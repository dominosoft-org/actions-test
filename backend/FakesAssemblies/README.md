# FakesAssemblies

## はじめに

- FakesAssembliesソリューションはその名のとおりFakesアセンブリというものを生成するためのソリューションである。
  - 参考：[Microsoft Fakes](https://learn.microsoft.com/ja-jp/visualstudio/test/isolating-code-under-test-with-microsoft-fakes?view=vs-2022&tabs=csharp)。
  - 参考：[ビルド時間を最適化する](https://learn.microsoft.com/ja-jp/visualstudio/test/code-generation-compilation-and-naming-conventions-in-microsoft-fakes?view=vs-2022#optimize-build-times)。
- 生成したFakesアセンブリはNuGetのパッケージとしてリポジトリに登録して利用する。

## 注意事項

- 生成したFakesアセンブリはNeuroFrameworkの単体テストの実装に限って利用することができる。
- 便宜上NuGetのパッケージという形態をとっているが当該パッケージを配布してはならない。

## ビルド方法

- ソリューション全体をRelease構成でビルドする。
- ```PublishLocalNugetPackages```を実行する。これによりビルドの生成物をローカルのリポジトリに登録する。
