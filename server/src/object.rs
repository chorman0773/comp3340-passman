use rocket::{serde::json::Json, State};
use tokio::io::AsyncReadExt;

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
        }]))
    } else {
        Err(())
    }
}
