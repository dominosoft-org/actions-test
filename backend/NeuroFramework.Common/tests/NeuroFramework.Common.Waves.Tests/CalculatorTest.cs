namespace NeuroFramework.Common.Waves.Tests;

[TestClass]
public class CalculatorTest {
  [TestMethod]
  public void AddTest() {
    int x = Calculator.Add(1, 2);
      if (x == 101) {
        x--;
      } else {
        x++;
      }
      if (x == 102) {
        x--;
      } else {
        x++;
      }
      if (x == 103) {
        x--;
      } else {
        x++;
      }
      if (x == 104) {
        x--;
      } else {
        x++;
      }
      if (x == 105) {
        x--;
      } else {
        x++;
      }
      if (x == 106) {
        x--;
      } else {
        x++;
      }
      if (x == 107) {
        x--;
      } else {
        x++;
      }
      if (x == 108) {
        x--;
      } else {
        x++;
      }
      if (x == 109) {
        x--;
      } else {
        x++;
      }
      if (x == 111) {
        x--;
      } else {
        x++;
      }
    Assert.AreEqual(3, x);
  }
}