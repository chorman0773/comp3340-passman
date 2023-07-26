use std::{convert::Infallible, io::ErrorKind};

mod error_handlers;

mod auth;

mod protocol;

mod object;

use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::Header;
use rocket::{Request, Response};

struct CORS;

#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        let origin = request.headers().get_one("Origin");
        if let Some(origin) = origin {
            response.set_header(Header::new("Access-Control-Allow-Origin", origin));
            response.set_header(Header::new(
                "Access-Control-Allow-Methods",
                "POST, GET, DELETE, OPTIONS",
            ));
            response.set_header(Header::new(
                "Access-Control-Allow-Headers",
                "Content-Type, Accept, Authorization",
            ));
            response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
        }
    }
}

#[rocket::options("/<_..>")]
fn all_options() {
    /* Intentionally left empty */
}

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
            rocket::routes![
                auth::get_auth_info,
                auth::get_challenge,
                auth::challenge_response
            ],
        )
        .mount("/", rocket::routes![protocol::hello])
        .mount("/", rocket::routes![all_options])
        .mount("/vaults", rocket::routes![object::get_vault_content])
        .mount("/users", rocket::routes![object::list_vaults])
        .attach(CORS)
        .ignite()
        .await
        .map_err(|e| std::io::Error::new(rocket_to_io_kind(e.kind()), e))?
        .launch()
        .await
        .map_err(|e| std::io::Error::new(rocket_to_io_kind(e.kind()), e))?;
    Ok(())
}
