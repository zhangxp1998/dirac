<?php

namespace SampleNamespace;

/**
 * PhpClass is a sample class.
 */
class PhpClass
{
    private string $name;

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    /**
     * getName returns the name.
     */
    public function getName(): string
    {
        return $this->name;
    }

    public function calculate(int $a, int $b): int
    {
        return $a + $b;
    }
}

/**
 * top_level_func is a top-level function.
 */
function top_level_func(int $x): int
{
    $obj = new PhpClass("example");
    echo $obj->getName();
    return $obj->calculate($x, 10);
}

top_level_func(5);

class AnotherClass {
    public static function staticMethod() {
        return "static";
    }
}
