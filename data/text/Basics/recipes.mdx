---
title: "p5.js レシピ集"
description: ""
updated: ""
slug: "P5js-Recipes"
keywords: []
prev: null
next: null
parent: null
---

# p5.js レシピ集

「○○ってどうやるんですか？」とよく聞かれるやつをレシピ集としてまとめていくところです。 説明だけ読んでもわからない場合は Demo のリンクを開いて、実際にプログラムを動作させてみてください。 聞かれるたびに随時増やしていくつもりなので、いろいろ聞いてみてください。

### p5.js で画像を使う

基本的には「[Reference の image()](https://p5js.org/reference/#/p5/image) を見てください」なのですが、 「リファレンス通りにプログラムを書いたのに画像が表示されません」という質問をよくされます。 JavaScript のプログラムから自分の PC 上にあるファイルにアクセスしようとするとセキュリティ上の制限でブロックされてしまうのがその理由です。 なので、作ったファイル一式（プログラムと画像）を Web サーバ上で公開すれば、プログラムはそのままにうまく動くようになります。

でも、自分の PC で作成中のプログラムで画像が表示されないのは不便です。 ではどうすればいいのかというと、自分の PC 上で Web サーバのプログラムを動作させればいいのです。 Atom を使っている人は [atom-live-server](https://atom.io/packages/atom-live-server) という拡張パッケージをインストールするのが一番簡単だと思います。 Visual Studio Code にも [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) という同じような拡張があります。

[p5.js のページで紹介されているその他いろいろな方法](https://github.com/processing/p5.js/wiki/Local-server)

### p5.js で縦書きテキスト

テキストを縦書きにする手っ取り早い方法は、文字列中に改行文字 `\n` を入れてしまうことです。 `text("欅\n坂\n46", 100, 200);` とかそんな感じ。 縦書きをたくさん使いたい場合には関数を作っておくと便利でしょう。 縦書きにした文字を中央揃えしたい場合は `textAlign(CENTER, CENTER);` などとします。

[Demo (p5.js Web Editor)](https://editor.p5js.org/tnishida/sketches/1z-guNgDE)

```javascript
function setup() {
  createCanvas(400, 400);
  textSize(32);
}

function draw() {
  background(220);

  textAlign(CENTER, CENTER);  
  text("欅\n坂\n46", 100, 200);

  verticalText("欅坂46", 300, 200);
}

function verticalText(t, x, y){
  push();
  textAlign(CENTER, CENTER);  
  const vt = t.split('').join('\n');
  text(vt, x, y);
  pop();
}
```

### 時間制限があるゲーム

時間によって動作が変わるプログラムを作るときには、プログラム開始から何ミリ秒経過したかが得られる [millis()](https://p5js.org/reference/#/p5/millis) を使うとよいでしょう。 スタート時刻を `startTime = millis()` といった感じで変数に覚えておき、スタートから何ミリ秒経過したかは `millis() - startTime` と計算します。

ゲーム開始前・ゲーム中・ゲーム終了後（時間経過後）と3種類の動作を行う必要が出てきますので、今どの状態なのかを変数に覚えさせておきます。以下の例では、それぞれの状態を変数 `state` に 0, 1, 2 として保存しています。

[Demo (p5.js Web Editor)](https://editor.p5js.org/tnishida/sketches/C8RdC_z0N)

```javascript
const limit = 10; // 制限時間[秒]
let startTime;
let state;

function setup() {
  createCanvas(400, 400);

  textAlign(CENTER, CENTER);
  textSize(32);
  state = 0;
}

function draw() {
  background(220);

  if (state == 0) { // ゲーム開始前
    text("Click to start", width / 2, height / 2);
  } else if (state == 1) { // ゲーム中
    let ellapsedTime = (millis() - startTime) / 1000;
    if (ellapsedTime > limit) {
      state = 2;
    } else {
      let remainingTime = limit - ellapsedTime;
      text(floor(remainingTime), width / 2, height / 2);
    }
  } else if (state == 2) { // ゲーム終了後
    text("Game Over", width / 2, height / 2);
  }
}

function mouseClicked() {
  if (state == 0) {
    startTime = millis();
    state = 1;
  }
}  
```

### もっといろいろなアニメーション

#### 回転する

図形を回転させるには [rotate(angle)](https://p5js.org/reference/#/p5/rotate) が使えますが、原点 (0, 0) を中心とした回転になるので注意が必要です。 任意の点 (x, y) で回転させるには事前に [translate(x, y)](https://p5js.org/reference/#/p5/translate) で原点を動かしておく必要があります。 たとえば `translate(width / 2, height / 2)` を実行した後は、ウィンドウの中心が (0, 0) になります。 rotate や translate をして回転した図形を描画した後は [resetMatrix()](https://p5js.org/reference/#/p5/resetMatrix) でいつもの座標系（左上隅が原点）に戻すことができます。

[Demo (p5.js Web Editor)](https://editor.p5js.org/tnishida/sketches/sKw7sFgnM)

```javascript
let angle;

function setup() {
  createCanvas(400, 400);
  angle = 0;
}

function draw() {
  background(220);
  rectMode(CENTER);
  
  fill(255, 0, 0);
  rect(50, 50, 30, 30); // red square
  
  translate(width / 2, height / 2);
  rotate(angle);
  
  fill(0, 255, 0);
  rect(0, 0, 30, 30); // green square
  
  fill(0, 0, 255);
  rect(50, 50, 30, 30); // blue square

  resetMatrix();
  
  fill(255, 255, 255); // white square
  rect(0, 0, 30, 30);
  
  angle += TWO_PI * 0.002;
}
```

#### ジャンプする

「何か操作をしたときに上向きの速度が発生すること」＋「空中にいる間、重力に引っ張られることで下向きに加速すること」の２つによってジャンプのアニメーションを実現することができます。 空中にいるか、地上にいるかの条件分岐が必要になります。下の例では、ある y 座標を地面として、それより上を空中としています。

[Demo (p5.js Web Editor)](https://editor.p5js.org/tnishida/sketches/Wv_-BBBaA)

```javascript
const g = 1;     // 重力（いろいろな値を試してみましょう）
const jump = 20; // ジャンプ力（いろいろな値を試してみましょう）
const ground = 20;
const size = 20;

let x, y, vy;

function setup() {
  createCanvas(400, 400);
  
  x = width / 2;
  y = height - ground - size / 2;
  vy = 0;
}

function draw() {
  background(220);
  
  let gy = height - ground;
  line(0, gy, width, gy); // 地面の線
  
  ellipse(x, y, size, size);
  
  y += vy;

  
  if(y < height - ground - size / 2){ // 地面より上、つまり空中にいる
    vy += g; // 下方向に重力の影響で加速する
  }
  else{
    vy = 0;
    y = height - ground - size / 2;
  }
}

function mousePressed(){
  if(y >= height - ground - size / 2){ // 地面にいるときだけジャンプできる（この条件をなくせば空中ジャンプが可能になります）
    vy = -jump;     
  }
}
```

#### 何かを追いかけて動く・動いたり止まったりする

(xA, yA) にいる物体Aが、 (xB, yB) にいる物体B を速度 v で追いかけることを考えます。

1.  `dist(xA, yA, xB, yB)` で AB の距離 d を計算します。
2.  (vx, vy) = (xB - xA, yB - yA) × (v / d)

止まったり動いたりするのは、今動いているかどうかを変数に保持しておくだけでできますので簡単でしょう。

[Demo (p5.js Web Editor)](https://editor.p5js.org/tnishida/sketches/d-5iHfaUF)

```javascript
const v = 2;
const size = 20;

let x, y, moving;

function setup() {
  createCanvas(400, 400);
  x = width / 2;
  y = height / 2;
  moving = false;
}

function draw() {
  background(220);

  ellipse(x, y, size, size);

  if (moving) {
    let d = dist(mouseX, mouseY, x, y);

    let vx = ((mouseX - x) / d) * v;
    let vy = ((mouseY - y) / d) * v;

    x += vx;
    y += vy;
  }
}

function mousePressed() {
  moving = !moving; // moving が true だったら false になる　逆もまたしかり
} 
```