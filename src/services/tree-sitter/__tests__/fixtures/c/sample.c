#include <stdio.h>
#include "sample.h"

// say_hello function implementation.
void say_hello(const char* name) {
    printf("Hello, %s!\n", name);
}

// top_level_func function.
int top_level_func(int x) {
    MyStruct s;
    s.id = x;
    say_hello("World");
    return s.id + 10;
}

int main() {
    top_level_func(5);
    return 0;
}
