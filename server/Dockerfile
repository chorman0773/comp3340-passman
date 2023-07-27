FROM rust

WORKDIR /server

COPY ./Cargo.toml .
COPY ./Cargo.lock .
RUN mkdir ./src
RUN "echo" "fn main() {}" > "./src/lib.rs"
COPY ./rust-toolchain.toml ./rust-toolchain.toml

RUN "cargo" "build"

COPY ./src ./src
COPY ./tests ./tests
COPY ./data ./data

ENV ROCKET_ADDRESS "0.0.0.0"
RUN "cargo" "build"

CMD [ "cargo", "run" ]
