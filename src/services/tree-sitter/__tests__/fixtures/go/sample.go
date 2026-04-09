package main

import (
	"fmt"
)

// GoStruct is a sample struct.
type GoStruct struct {
	Name string
}

// NewGoStruct creates a new GoStruct.
func NewGoStruct(name string) *GoStruct {
	return &GoStruct{Name: name}
}

// GetName is a method on GoStruct.
func (s *GoStruct) GetName() string {
	return s.Name
}

// TopLevelFunc is a top-level function.
func TopLevelFunc(x int) int {
	obj := NewGoStruct("example")
	fmt.Println(obj.GetName())
	return x + 10
}

func main() {
	TopLevelFunc(5)
}
