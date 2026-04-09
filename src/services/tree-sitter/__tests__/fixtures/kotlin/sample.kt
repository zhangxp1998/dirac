package com.example

/**
 * KotlinClass is a sample class.
 */
class KotlinClass(var name: String) {

    /**
     * getName returns the name.
     */
    fun getName(): String {
        return this.name
    }

    fun calculate(a: Int, b: Int): Int {
        return a + b
    }

    companion object {
        fun companionMethod(): String {
            return "companion"
        }
    }
}

/**
 * topLevelFunc is a top-level function.
 */
fun topLevelFunc(x: Int): Int {
    val obj = KotlinClass("example")
    println(obj.getName())
    return obj.calculate(x, 10)
}

fun main() {
    topLevelFunc(5)
}

data class DataClass(val id: Int)

object Singleton {
    fun singletonMethod() {
        println("singleton")
    }
}

