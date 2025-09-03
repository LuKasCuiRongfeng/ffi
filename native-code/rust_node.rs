#![deny(clippy::all)]

use napi_derive::napi;

#[napi] // ← 暴露给 JS
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 | 1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

#[napi(js_name = "add")]
pub fn plus_100(input: u32) -> u32 {
    input + 100
}
