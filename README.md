open-search-mapping-to-ts

# 使い方
- ローカルにcloneする場合
    1. .env
        ```
        MAPPING_URL=mappingへのURL (http(s)://~ or jsonへのファイルパス)
        OUT_FILE=出力先ファイル名
        REQUIRED_ALL=true or false
        ```

    1. 実行
        ```
        $ npm ci
        $ npm start
        ```
- npxで実行する場合
    - コマンド
        ```
        npx open-search-mapping-to-ts \
            -u url-to-mapping \
            -o path-to-output-file \
            -r
        ```
    - 使用可能なオプション
        |名前|エイリアス|必須|デフォルト|説明
        |-|-|-|-|-|
        |url|u| :o: |-|mappingへのURL(http://~ or https://~ or jsonへのファイルパス)|
        |outFile|o| :x: |generated/schmea.ts|出力先ファイルパス|
        |requiredAll|r| :x: |false|プロパティすべてを必須項目にする|

