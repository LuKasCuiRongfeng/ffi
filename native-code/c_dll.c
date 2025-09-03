#define FIBONACCI_EXPORTS
#include "c_dll.h"

unsigned long long fibonacci(unsigned int n)
{
    if (n < 2)          /* 基准条件：F(0)=0, F(1)=1 */
        return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}