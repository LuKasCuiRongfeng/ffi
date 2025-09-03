#ifndef FIBONACCI_H
#define FIBONACCI_H

#ifdef _WIN32            /* Windows 平台导出/导入宏 */
#ifdef FIBONACCI_EXPORTS /* 仅在编译 DLL 时定义 */
#define FIB_API __declspec(dllexport)
#else
#define FIB_API __declspec(dllimport)
#endif
#else /* Linux/macOS 等 */
#define FIB_API
#endif

#ifdef __cplusplus
extern "C" {
#endif

/* 计算第 n 个斐波那契数（迭代实现，O(n)） */
FIB_API unsigned long long fibonacci(unsigned int n);

#ifdef __cplusplus
}
#endif

#endif /* FIBONACCI_H */