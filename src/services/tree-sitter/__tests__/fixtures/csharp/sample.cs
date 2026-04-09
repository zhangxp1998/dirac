using System;

namespace SampleNamespace
{
    public class CSharpClass
    {
        public string Name { get; set; }

        public CSharpClass(string name)
        {
            Name = name;
        }

        public string GetName()
        {
            return Name;
        }

        public int Calculate(int a, int b)
        {
            return a + b;
        }
    }

    public static class Program
    {
        public static void Main(string[] args)
        {
            var obj = new CSharpClass("example");
            Console.WriteLine(obj.GetName());
            Console.WriteLine(obj.Calculate(5, 10));
        }

        public static int TopLevelFunc(int x)
        {
            var obj = new CSharpClass("top-level");
            return obj.Calculate(x, 10);
        }
    }
}
