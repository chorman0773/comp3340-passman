# Object Access

The endpoints in this section perform actions on objects stored by the server. 

Each endpoint in this section requires a Tunneled request and with an `Authorization` header set according to [protocol](protocol.md#tunneling).

## Vault Access

### List Vaults

Endpoint: `/users/{userid}/vaults`

Method: GET

Mode: Tunneled

URL Fields: `userid` is the UUID of the account to list vaults for

Response: Error or 200 OK 

Response body:
```rust
pub struct ListVaultsResponse{
    vaults: Vec<Vault>
}

pub struct Vault{
    vault_id: Uuid,
    vault_key: Vec<u8>
}
```