use std::{
    ops::{Deref, DerefMut},
    str::FromStr,
    time::{Instant, SystemTime},
};

use base64::Engine;

#[repr(transparent)]
#[derive(bincode::Encode, Debug, Hash, PartialEq, Eq)]
pub struct ByteSlice {
    inner: [u8],
}

impl Deref for ByteSlice {
    type Target = [u8];
    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}

impl DerefMut for ByteSlice {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.inner
    }
}

impl AsRef<[u8]> for ByteSlice {
    fn as_ref(&self) -> &[u8] {
        &self.inner
    }
}

impl AsMut<[u8]> for ByteSlice {
    fn as_mut(&mut self) -> &mut [u8] {
        &mut self.inner
    }
}

impl AsRef<ByteSlice> for [u8] {
    fn as_ref(&self) -> &ByteSlice {
        unsafe { &*(self as *const [u8] as *const ByteSlice) }
    }
}

impl AsMut<ByteSlice> for [u8] {
    fn as_mut(&mut self) -> &mut ByteSlice {
        unsafe { &mut *(self as *mut [u8] as *mut ByteSlice) }
    }
}

impl serde::Serialize for ByteSlice {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let engine = base64::engine::general_purpose::STANDARD_NO_PAD;

        let buf = engine.encode(self);

        serializer.serialize_str(&buf)
    }
}

pub fn deseriaize_slice<'a, D: serde::Deserializer<'a>>(
    x: &mut ByteSlice,
    de: D,
) -> Result<(), D::Error> {
    use serde::Deserialize;
    let st = <&str>::deserialize(de)?;

    let st = st.trim_end_matches('=');

    let engine = base64::engine::general_purpose::STANDARD_NO_PAD;

    engine
        .decode_slice(st, x)
        .map_err(<D::Error as serde::de::Error>::custom)?;

    Ok(())
}

#[derive(bincode::Decode, bincode::Encode, Copy, Clone, Debug, Hash, PartialEq, Eq)]
pub struct ByteArray<const N: usize>([u8; N]);

impl<const N: usize> Default for ByteArray<N> {
    fn default() -> Self {
        Self::new([0; N])
    }
}

impl<const N: usize> From<[u8; N]> for ByteArray<N> {
    fn from(value: [u8; N]) -> Self {
        Self::new(value)
    }
}

impl<const N: usize> ByteArray<N> {
    pub const fn new(value: [u8; N]) -> Self {
        Self(value)
    }

    pub const fn into_inner(self) -> [u8; N] {
        self.0
    }
}

impl<const N: usize> Deref for ByteArray<N> {
    type Target = ByteSlice;
    fn deref(&self) -> &Self::Target {
        let x: &[u8] = &self.0;

        x.as_ref()
    }
}

impl<const N: usize> DerefMut for ByteArray<N> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        let x: &mut [u8] = &mut self.0;

        x.as_mut()
    }
}

impl<const N: usize> serde::Serialize for ByteArray<N> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        ByteSlice::serialize(self, serializer)
    }
}

impl<'a, const N: usize> serde::Deserialize<'a> for ByteArray<N> {
    fn deserialize<D>(de: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'a>,
    {
        let mut arr = Self::default();
        deseriaize_slice(&mut arr, de)?;
        Ok(arr)
    }
}

#[derive(bincode::Decode, bincode::Encode, Clone, Debug, Hash, PartialEq, Eq)]
pub struct ByteVec(Vec<u8>);

impl ByteVec {
    pub const fn new() -> Self {
        Self(Vec::new())
    }

    pub const fn from_vec(v: Vec<u8>) -> Self {
        Self(v)
    }

    pub fn with_capacity(cap: usize) -> Self {
        Self(Vec::with_capacity(cap))
    }

    pub fn from_slice(x: &[u8]) -> Self {
        let mut inner = Vec::with_capacity(x.len());
        unsafe { core::ptr::copy_nonoverlapping(x.as_ptr(), inner.as_mut_ptr(), x.len()) };
        unsafe {
            inner.set_len(x.len());
        }
        Self(inner)
    }
}

impl Deref for ByteVec {
    type Target = Vec<u8>;
    fn deref(&self) -> &Self::Target {
        &self.0
    }
}
impl DerefMut for ByteVec {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl AsRef<ByteSlice> for ByteVec {
    fn as_ref(&self) -> &ByteSlice {
        <[u8] as AsRef<_>>::as_ref(self)
    }
}

impl AsMut<ByteSlice> for ByteVec {
    fn as_mut(&mut self) -> &mut ByteSlice {
        <[u8] as AsMut<_>>::as_mut(self)
    }
}

impl serde::Serialize for ByteVec {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        ByteSlice::serialize(self.as_ref(), serializer)
    }
}

impl<'de> serde::Deserialize<'de> for ByteVec {
    fn deserialize<D>(de: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let st = <&str>::deserialize(de)?;

        let st = st.trim_end_matches('=');

        let engine = base64::engine::general_purpose::STANDARD_NO_PAD;

        let mut out = ByteVec::with_capacity((st.len() * 3 + 3) / 4);

        engine
            .decode_vec(st, &mut out)
            .map_err(|e| <D::Error as serde::de::Error>::custom(e));

        Ok(out)
    }
}

#[derive(bincode::Decode, bincode::Encode, Copy, Clone, Debug, Hash, PartialEq, Eq)]
pub struct Uuid {
    lo: u64,
    hi: u64,
}

impl core::fmt::Display for Uuid {
    fn fmt(&self, f: &mut core::fmt::Formatter) -> core::fmt::Result {
        let mut hitop = self.hi >> 32;
        let mut himid = (self.hi >> 16) & 0xFFFF;
        let mut hibottom = self.hi & 0xFFFF;
        let mut lotop = self.lo >> 48;
        let mut lobottom = self.lo & 0xFFFFFFFFFFFF;

        f.write_fmt(format_args!(
            "{:08x}-{:04x}-{:04x}-{:04x}-{:012x}",
            hitop, himid, hibottom, lotop, lobottom
        ))
    }
}

const fn to_hexdig(c: u8) -> Option<u64> {
    if b'0' <= c && c <= b'9' {
        return Some((c - b'0') as u64);
    } else if b'A' <= c && c <= b'F' {
        return Some((c - b'A') as u64 + 10);
    } else if b'a' <= c && c <= b'f' {
        return Some((c - b'a') as u64 + 10);
    } else {
        return None;
    }
}

#[derive(Copy, Clone, Debug, Hash, PartialEq, Eq)]
pub enum TryParseUuidError {
    InvalidLen(usize),
    InvalidDigit(usize),
    UnexpectedChar(usize),
}

impl core::fmt::Display for TryParseUuidError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("failed to parse uuid")
    }
}

impl Uuid {
    pub const fn nil() -> Uuid {
        Uuid { lo: 0, hi: 0 }
    }

    pub const fn try_parse_uuid(st: &str) -> Result<Uuid, TryParseUuidError> {
        use TryParseUuidError::*;
        let st = match st.as_bytes() {
            [b'{', rest @ .., b'}'] => rest,
            x => x,
        };
        if st.len() != 36 {
            return Err(InvalidLen(st.len()));
        }

        let mut i = 0;

        let mut hi = 0u64;
        let mut lo = 0u64;

        while i < 8 {
            let c = st[i];

            if let Some(dig) = to_hexdig(c) {
                hi <<= 4;
                hi |= (dig as u64);
            } else {
                return Err(InvalidDigit(i));
            }
            i += 1;
        }

        if st[i] != b'-' {
            return Err(UnexpectedChar(i));
        }

        i += 1;

        while i < 13 {
            let c = st[i];

            if let Some(dig) = to_hexdig(c) {
                hi <<= 4;
                hi |= (dig as u64);
            } else {
                return Err(InvalidDigit(i));
            }
            i += 1;
        }

        if st[i] != b'-' {
            return Err(UnexpectedChar(i));
        }

        i += 1;

        while i < 18 {
            let c = st[i];

            if let Some(dig) = to_hexdig(c) {
                hi <<= 4;
                hi |= (dig as u64);
            } else {
                return Err(InvalidDigit(i));
            }
            i += 1;
        }

        if st[i] != b'-' {
            return Err(UnexpectedChar(i));
        }

        i += 1;

        while i < 23 {
            let c = st[i];

            if let Some(dig) = to_hexdig(c) {
                lo <<= 4;
                lo |= (dig as u64);
            } else {
                return Err(InvalidDigit(i));
            }
            i += 1;
        }

        if st[i] != b'-' {
            return Err(UnexpectedChar(i));
        }

        i += 1;

        while i < 36 {
            let c = st[i];

            if let Some(dig) = to_hexdig(c) {
                lo <<= 4;
                lo |= (dig as u64);
            } else {
                return Err(InvalidDigit(i));
            }
            i += 1;
        }

        Ok(Uuid { hi, lo })
    }

    pub const fn parse_uuid(st: &str) -> Uuid {
        match Self::try_parse_uuid(st) {
            Ok(uuid) => uuid,
            Err(TryParseUuidError::InvalidLen(_)) => panic!("Invalid UUID length"),
            Err(TryParseUuidError::InvalidDigit(_)) => {
                panic!("Encountered an invalid character where a hex digit is expected")
            }
            Err(TryParseUuidError::UnexpectedChar(_)) => {
                panic!("Encountered an invalid character in the UUID")
            }
        }
    }
}

impl FromStr for Uuid {
    type Err = TryParseUuidError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::try_parse_uuid(s)
    }
}

impl serde::Serialize for Uuid {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&self.to_string())
    }
}

impl<'de> serde::Deserialize<'de> for Uuid {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let st = <&str>::deserialize(deserializer)?;

        Uuid::try_parse_uuid(st).map_err(|e| <D::Error as serde::de::Error>::custom(e))
    }
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
#[serde(transparent)]
pub struct Timestamp(u64);

const fn duration_to_encoded(dur: std::time::Duration) -> u64 {
    let enc = dur.as_secs() << 10;

    enc | (dur.subsec_millis() as u64)
}

const fn encoded_to_duration(enc: u64) -> std::time::Duration {
    let seconds = enc >> 10;

    let milis = (enc & 1024) as u32;

    if milis > 999 {
        panic!("Invalid out of range encoded timestamp")
    }

    std::time::Duration::new(seconds, milis * 1000000)
}

impl Timestamp {
    pub fn from_system(time: SystemTime) -> Self {
        Self(duration_to_encoded(
            time.duration_since(SystemTime::UNIX_EPOCH).unwrap(),
        ))
    }

    pub fn into_system(self) -> SystemTime {
        let dur = encoded_to_duration(self.0);
        SystemTime::UNIX_EPOCH + dur
    }
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
#[serde(transparent)]
pub struct Duration(u64);

impl Duration {
    pub const fn from_full(time: std::time::Duration) -> Self {
        Self(duration_to_encoded(time))
    }

    pub const fn into_full(self) -> std::time::Duration {
        encoded_to_duration(self.0)
    }
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
pub enum PublicKeyType {
    Ec25519,
    Rsa,
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
pub enum HashType {
    Sha1,
    Sha256,
    Sha3_256,
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
pub enum ErrorCode {
    InvalidRequest,
    NoSuchUser,
    RateLimitExceeded,
    InvalidSession,
    AuthenticatonFailure,
    NoSuchObject,
    AccessViolation,
}
