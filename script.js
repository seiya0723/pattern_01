window.addEventListener("load" , function (){
    const canvas        = document.querySelector('#canvas');
    const ctx           = canvas.getContext('2d');

    function layer_add(){
        let init        = $("#init_layer").clone();
        let layer_area  = $("#layer_area");
        let num         = String($("#layer_area > .layer").length + 1);

        init.attr("id","layer_"+num);
        layer_area.append(init);

        $("#layer_"+num+" .layer_title").val("レイヤー"+num);
        
    }
    layer_add();

    //レイヤーの削除
    function layer_delete(target){
        console.log(target)

        target.remove();

        //TODO:レイヤーが1,2,3とある状態で2を消すと、1と3になる。その後レイヤー追加をすると、レイヤー3が追加され、IDが重複する。
    }

    //レイヤーの交換
    function layer_exchange(target){
        //レイヤーの上と下を交換する。(一番下、もしくは一番上のデータは最初もしくは末端と交換)
        console.log(target)
    }

    //描画の流れ
    //1、レイヤーごとに描画を行う。(1つのレイヤーのデータを手に入れる)
    //2、レイヤーのデータに基づき、描画を行う
    //3、間隔は太さと位置も考慮し、300pxをはみ出したら描画を終える。←処理に問題が出るのでは？

    function draw(target){

        //非表示のレイヤーは表示させない
        if ( !$(target + " .layer_visible").prop("checked") ){
            return false;
        }


        //ここでレイヤーの間隔を抜き取り、ループ開始
        let color       = $(target + " .color").val();

        let span        = Number($(target + " .span").val());
        let weight      = Number($(target + " .weight").val());
        let position    = Number($(target + " .position").val());
        let alpha       = Number($(target + " .alpha").val());

        let counter     = 0;
        let y           = position + counter*weight + counter*span;

        //間隔に応じて描画
        //TODO:描画個数を指定できるように対応。
        if (span !== 0 || weight !== 0){
            while (y < 300){

                ctx.beginPath();

                ctx.strokeStyle = color;
                ctx.lineWidth   = weight;
                ctx.globalAlpha = alpha;

                //X軸方向は常に0と300。y軸方向の位置はユーザー指定、y軸の位置は太さと間隔も加算する。
                ctx.moveTo(0,   y);
                ctx.lineTo(300, y);


                ctx.stroke();
                ctx.closePath();

                counter++;
                y = position + counter*weight + counter*span;
            }
        }

    }

    //線の描画
    function draw_start(){
        //初期化してから描画する。
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //ここで各レイヤーの要素を抜き取り、レイヤーごとにループさせる。
        let layers  = $("#layer_area > .layer");
        let length  = layers.length;

        for (let i=0;i<length;i++){
            //引数にレイヤーのID名を指定
            draw("#"+layers.eq(i).attr("id"));
        }
    }
    draw_start();

    //イベント(色変更、スライダー操作などで発火、draw関係を実行)
    //TIPS:発火条件はchangeではなく、inputを指定する(これでスライダーが変化すると同時に即関数が実行される。)
    //動的に追加されるので、documentで指定
    $(document).on("input", ".span"    ,function() { draw_start(); });
    $(document).on("input", ".color"   ,function() { draw_start(); });
    $(document).on("input", ".weight"  ,function() { draw_start(); });
    $(document).on("input", ".position",function() { draw_start(); });
    $(document).on("input", ".alpha"   ,function() { draw_start(); });

    $("#layer_add").on("click",function() { layer_add();draw_start(); });

    $(document).on("click", ".layer_delete"     ,function() { layer_delete($(this).parent());   });
    $(document).on("click", ".layer_exchange"   ,function() { layer_exchange($(this).parent()); });
    $(document).on("click", ".layer_visible"    ,function() { draw_start(); });

});

