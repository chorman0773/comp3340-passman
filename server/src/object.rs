use rocket::State;
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
