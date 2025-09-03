#[unsafe(no_mangle)] // 防止 Rust 改名，保持 C 可识别
pub extern "C" fn fib(n: u32) -> u64 {
    match n {
        0 | 1 => 1,
        _ => fib(n - 1) + fib(n - 2),
    }
}