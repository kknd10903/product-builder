$(".sub,.sub_bg").hide();
$(".menu>li").on("mouseover", function(){
 $(".sub,.sub_bg").stop().fadeIn()
})
$(".menu>li").on("mouseout", function(){
 $(".sub,.sub_bg").stop().fadeOut()
})

/* 
 기명함수 사용법
 function 함수이름() {
   실행문
}

 무기명함수 사용법
 function () {
}

*/


/* 팝업 창 */
$(".popup").hide(); //부모가 보이지 않으면 자식도 보이지 않음 (팝업bg부모)
$(".notice>li:nth-child(1)").on("click", function(){
  $(".popup").show();
})
$(".close").on("click", function(){
 $(".popup").hide();
})

/* 탭메뉴_갤러리 */
$(".gallery").hide();
$(".tab_title>li:nth-child(2)").on("click", function(){
 $(".gallery").show();
 $(".notice").hide(); //클릭시 notice 숨김
 $(this).addClass("active"); //클래스 추가 /  this : 상위 이벤트객체를 그대로 받음 / 클래스 지정시 순수 이름만 씀 .사용x
 $(this).siblings().removeClass("active"); //형제요소 지정 () <- 숫자로 지정가능
})

$(".tab_title>li:nth-child(1)").on("click", function(){
 $(".gallery").hide();
 $(".notice").show();
 $(this).addClass("active");
 $(this).siblings().removeClass("active");
})

/* 신한증권 API를 이용한 실시간 종목 순위 조회 */
$(function() {
  const apiKey = "YOUR_API_KEY"; // 여기에 실제 신한증권 API 키를 입력하세요.
  const apiUrl = "https://gapi.shinhaninvest.com:8443/openapi/v1.0/ranking/issue";

  async function fetchStockRanking() {
    const requestData = {
      dataHeader: {
        "content-type": "application/json; charset=UTF-8"
      },
      dataBody: {
        "query_type": "거래량상위" // 예: 거래량상위, 상승률상위, 하락률상위 등
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apiKey': apiKey
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      displayStockRanking(data.dataBody);

    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
      const rankingList = $("#stock-ranking-list");
      rankingList.html("<li>데이터를 불러오는 데 실패했습니다. API 키를 확인해주세요.</li>");
    }
  }

  function displayStockRanking(rankingData) {
    const rankingList = $("#stock-ranking-list");
    rankingList.empty(); // 기존 목록을 비웁니다.

    if (rankingData && rankingData.length > 0) {
      rankingData.forEach(stock => {
        const changeAmount = parseInt(stock.compare_prev_price, 10);
        let changeClass = '';
        let changeSymbol = '';

        if (changeAmount > 0) {
          changeClass = 'increase';
          changeSymbol = '▲';
        } else if (changeAmount < 0) {
          changeClass = 'decrease';
          changeSymbol = '▼';
        }

        const listItem = `
          <li>
            <span class="rank">${stock.ranking}</span>
            <span class="stock-name">${stock.stock_name}</span>
            <span class="price">${parseInt(stock.current_price, 10).toLocaleString()}원</span>
            <span class="change ${changeClass}">
              ${changeSymbol} ${Math.abs(changeAmount).toLocaleString()}
            </span>
          </li>
        `;
        rankingList.append(listItem);
      });
    } else {
      rankingList.html("<li>표시할 순위 정보가 없습니다.</li>");
    }
  }

  // 페이지 로드 시 주식 순위 정보를 가져옵니다.
  fetchStockRanking();

  // 1분마다 데이터를 새로고침합니다.
  setInterval(fetchStockRanking, 60000);
});