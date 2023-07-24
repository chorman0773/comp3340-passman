use std::{convert::Infallible, io::ErrorKind};

mod error_handlers;

mod auth;

mod protocol;

#[rocket::main]
async fn main() {
    match real_main().await {
        Ok(_) => (),
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

async fn real_main() -> Result<(), std::io::Error> {
    let gstate = auth::ActiveSessions::new();
    let server = rocket::build()
        .manage(gstate)
        .mount(
            "/auth",
            rocket::routes![auth::get_auth_info, auth::get_challenge],
        )
        .mount("/", rocket::routes![protocol::hello])
        .ignite()
        .await
        .map_err(|e| std::io::Error::new(rocket_to_io_kind(e.kind()), e))?
        .launch()
        .await
        .map_err(|e| std::io::Error::new(rocket_to_io_kind(e.kind()), e))?;
    Ok(())
}
