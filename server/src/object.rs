use rocket::{serde::json::Json, State};
use tokio::io::{AsyncReadExt, AsyncWriteExt};

use std::path::PathBuf;

use crate::{
    auth::{ActiveSessions, Authorization},
    protocol::Uuid,
};

#[rocket::get("/<vaultid>/<file>")]
pub async fn get_vault_content(
    _authorization: Authorization,
    _sessions: &State<ActiveSessions>,
    vaultid: Uuid,
    file: &str,
) -> Result<Vec<u8>, std::io::Error> {
    let mut pathbuf = PathBuf::from("data");
    pathbuf.push(vaultid.to_string());
    pathbuf.push(file);
    let mut file = tokio::fs::File::open(&pathbuf).await?;
    let mut out = Vec::new();
    file.read_to_end(&mut out).await?;

    Ok(out)
}

#[rocket::post("/<vaultid>/<file>", data = "<data>")]
pub async fn push_vault_content(
    _authorization: Authorization,
    _sessions: &State<ActiveSessions>,
    vaultid: Uuid,
    file: &str,
    data: &[u8],
) -> Result<(), std::io::Error> {
    let mut pathbuf = PathBuf::from("data");
    pathbuf.push(vaultid.to_string());
    pathbuf.push(file);
    let mut file = tokio::fs::File::create(&pathbuf).await?;
    file.write_all(data).await?;

    Ok(())
}

#[derive(
    Copy,
    Clone,
    Debug,
    Hash,
    PartialEq,
    Eq,
    bincode::Encode,
    bincode::Decode,
    serde::Serialize,
    serde::Deserialize,
)]
pub struct CreateVaultResponse {
    uuid: Uuid,
}

#[rocket::post("/create-vault")]
pub async fn create_vault(
    _authorization: Authorization,
    _sessions: &State<ActiveSessions>,
) -> Json<CreateVaultResponse> {
    let uuid = Uuid::generate_v7_id();

    let mut pathbuf = PathBuf::from("data");
    pathbuf.push(uuid.to_string());

    tokio::fs::create_dir(pathbuf).await.unwrap();

    Json(CreateVaultResponse { uuid })
}

#[derive(
    Clone,
    Debug,
    Hash,
    PartialEq,
    Eq,
    bincode::Decode,
    bincode::Encode,
    serde::Serialize,
    serde::Deserialize,
)]
pub struct VaultInfo {
    name: String,
    uuid: Uuid,
    description: String,
}

#[rocket::get("/<userid>/vaults")]
pub async fn list_vaults(
    _authorization: Authorization,
    _sessions: &State<ActiveSessions>,
    userid: Uuid,
) -> Result<Json<Vec<VaultInfo>>, ()> {
    if userid == Uuid::nil() {
        Ok(Json(vec![VaultInfo {
            name: format!("Personal Vault"),
            uuid: Uuid::parse_uuid("99bd3e87-0bd2-48e3-a840-98aea0a1c07c"),
            description: format!("A personal vault, just for you!"),
        }]))
    } else {
        Err(())
    }
}
