```
aws s3 sync s3://saintsfield.comes.today src/Assets
python read_me_parser/main.py
yarn build
aws s3 sync build s3://saintsfield.comes.today
aws cloudfront create-invalidation --distribution-id E18VS2F7D5ZUEO --paths '/*'
```
