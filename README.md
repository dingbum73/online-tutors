# online-tutors
<img width="950" alt="signin" src="https://github.com/dingbum73/online-tutors/assets/124600894/33da1239-c349-43dd-b201-bc15b37981fe">

![index](https://github.com/dingbum73/online-tutors/assets/124600894/2c73d26a-1906-44a8-961b-31dc9696f06c)


## 介紹
- 這是一個英文家教預約平台
- 一般使用者需註冊且登入才能使用，提供google帳號登入方法
- Admin點選登入頁的右上角"Admin"，前往登入頁，登入成功後可以使用後台功能：看到全站使用者清單

### 功能
- 登入登出功能，也提供google帳號登入
- 在首頁可以瀏覽全部課程(老師)清單，並提供搜尋功能
- 可以查看單一課程(老師)，資訊包含：老師教學風格、評價、預約課程
- 可以預約近兩週的課程
- 可以在New Schedule取消已預約課程
- 可以更改帳密、自我介紹、頭像
- 可以提交申請老師表單
- 擁有老師身份，可以進入老師個人頁，並且更改教學風格、開放預約日期...等資訊
- Admin後台，擁有Admin身份可以瀏覽全站使用者清單

## 開始使用
- 本機安裝node.js and npm
- 複製專案到本機：Bash 指令 git clone https://github.com/dingbum73/online-tutors.git
- 進入專案資料夾：Bash 指令 cd online-tutors
- 安裝套件：Bash 指令 npm install
- 確認套件齊全(可參考下方開發工具)
- 建立.env檔案並填入相關資料(可參考.env example檔案)
- 建立temp資料夾
- 設定MySQL資料庫：username & password與專案config/config.json中development相同
- 建立資料庫資料表：Bash 指令 npx sequelize db:migrate
- 建立種子資料：Bash 指令 npx sequelize db:seed:all
- 啟動專案：Bash 指令 npm run dev

看到以下訊息，可至瀏覽器輸入下列網址開啟
Online-tutors web is running on http://localhost:3000


## 開發工具
- axios: 1.5.0
- bcryptjs: 2.4.3
- connect-flash: 0.1.1
- dayjs: 1.11.9
- express: 4.18.2
- express-handlebars: 7.1.2
- express-session: 1.17.2
- faker: 5.5.3
- imgur: 1.0.2
- method-override: 3.0.0
- multer: 1.4.3
- mysql2: 2.3.3
- passport: 0.6.0
- passport-google-oauth20: 2.0.0
- passport-local: 1.0.0
- sequelize: 6.32.1
- sequelize-cli: 6.2.0

