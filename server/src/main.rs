use std::{convert::Infallible, io::ErrorKind};

mod error_handlers;

mod auth;

mod protocol;

#[tokio::main]
async fn main() {
    match real_main().await {
        Ok(v) => match v {},
        Err(e) => {
            eprintln!("Fatal Error: {}", e);
            std::process::exit(1)
        }
    }
}

fn rocket_to_io_kind(e: &rocket::error::ErrorKind) -> ErrorKind {
    match e {
        rocket::error::ErrorKind::Bind(err) | rocket::error::ErrorKind::Io(err) => err.kind(),
        rocket::error::ErrorKind::Config(_) => ErrorKind::InvalidInput,
        rocket::error::ErrorKind::Collisions(_)
        | rocket::error::ErrorKind::FailedFairings(_)
        | rocket::error::ErrorKind::SentinelAborts(_)
        | rocket::error::ErrorKind::InsecureSecretKey(_)
        | rocket::error::ErrorKind::Shutdown(_, _)
        | _ => ErrorKind::Other,
    }
}

async fn real_main() -> Result<Infallible, std::io::Error> {
    let server = rocket::build()
        .mount(
            "/auth",
            rocket::routes![auth::get_auth_info, auth::get_challenge],
        )
        .ignite()
        .await
        .map_err(|e| std::io::Error::new(rocket_to_io_kind(e.kind()), e))?;

    loop {}
}
