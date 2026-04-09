package com.example;

/**
 * JavaClass is a sample class.
 */
public class JavaClass {
    private String name;

    public JavaClass(String name) {
        this.name = name;
    }

    /**
     * getName returns the name.
     */
    public String getName() {
        return this.name;
    }

    public int calculate(int a, int b) {
        return a + b;
    }

    public static class InnerClass {
        public String innerMethod() {
            return "inner";
        }
    }
}

class Main {
    public static void main(String[] args) {
        JavaClass obj = new JavaClass("example");
        System.out.println(obj.getName());
        System.out.println(obj.calculate(5, 10));
    }

    public static int topLevelFunc(int x) {
        JavaClass obj = new JavaClass("top-level");
        return obj.calculate(x, 10);
    }
}
