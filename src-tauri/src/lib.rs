use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DevOrbState {
    pub mood: String,
    pub energy: u32,
    pub focus_sessions: u32,
    pub rest_sessions: u32,
    pub last_focus_minutes: u32,
}

impl Default for DevOrbState {
    fn default() -> Self {
        Self {
            mood: "neutral".to_string(),
            energy: 70,
            focus_sessions: 0,
            rest_sessions: 0,
            last_focus_minutes: 25,
        }
    }
}

fn get_state_path() -> PathBuf {
    let home = dirs::home_dir().expect("Could not find home directory");
    let devorb_dir = home.join(".devorb");
    if !devorb_dir.exists() {
        fs::create_dir_all(&devorb_dir).expect("Failed to create .devorb directory");
    }
    devorb_dir.join("state.json")
}

#[derive(Debug, Serialize, Deserialize)]
struct OpenAIMessage {
    role: String,
    content: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct OpenAIRequest {
    model: String,
    messages: Vec<OpenAIMessage>,
    max_tokens: u32,
    temperature: f32,
}

#[derive(Debug, Deserialize)]
struct OpenAIChoice {
    message: OpenAIMessage,
}

#[derive(Debug, Deserialize)]
struct OpenAIResponse {
    choices: Vec<OpenAIChoice>,
}

mod commands {
    use super::*;

    #[tauri::command]
    pub fn read_state() -> Result<DevOrbState, String> {
        let path = get_state_path();
        if path.exists() {
            let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
            let state: DevOrbState = serde_json::from_str(&content).map_err(|e| e.to_string())?;
            Ok(state)
        } else {
            let default_state = DevOrbState::default();
            let json = serde_json::to_string_pretty(&default_state).map_err(|e| e.to_string())?;
            fs::write(&path, json).map_err(|e| e.to_string())?;
            Ok(default_state)
        }
    }

    #[tauri::command]
    pub fn write_state(state: DevOrbState) -> Result<(), String> {
        let path = get_state_path();
        let json = serde_json::to_string_pretty(&state).map_err(|e| e.to_string())?;
        fs::write(&path, json).map_err(|e| e.to_string())?;
        Ok(())
    }

    #[tauri::command]
    pub async fn get_llm_comment(
        focus_minutes: u32,
        rest_minutes: u32,
        session_count: u32,
        current_time: String,
        api_key: String,
    ) -> Result<String, String> {
        let prompt = format!(
            r#"당신은 데스크탑 화면에 떠 있는 작은 로봇 오브 펫입니다.
개발자를 도우며 짧고 따뜻하게 말합니다. 1~2문장만 출력하세요.
현재 상황:
- focus_minutes: {}
- rest_minutes: {}
- session_count_today: {}
- current_time: {}
개발자의 흐름을 방해하지 않고, 휴식/집중을 자연스럽게 권하는 한마디를 하세요."#,
            focus_minutes, rest_minutes, session_count, current_time
        );

        let request = OpenAIRequest {
            model: "gpt-4o-mini".to_string(),
            messages: vec![OpenAIMessage {
                role: "user".to_string(),
                content: prompt,
            }],
            max_tokens: 100,
            temperature: 0.7,
        };

        let client = reqwest::Client::new();
        let response = client
            .post("https://api.openai.com/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", api_key))
            .header("Content-Type", "application/json")
            .json(&request)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if !response.status().is_success() {
            return Err(format!("API error: {}", response.status()));
        }

        let api_response: OpenAIResponse = response.json().await.map_err(|e| e.to_string())?;

        let comment = api_response
            .choices
            .first()
            .map(|c| c.message.content.clone())
            .unwrap_or_else(|| "좋은 하루 되세요!".to_string());

        Ok(comment)
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::read_state,
            commands::write_state,
            commands::get_llm_comment
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
