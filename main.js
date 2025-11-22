"use srtict";

// 페이지 로드 시 주보 데이터 불러오기
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // 최신 주보 불러오기
    const bulletinData = await bulletinLoader.loadLatestBulletin();
    
    if (bulletinData) {
      // 주보 렌더링
      bulletinRenderer.renderBulletin(bulletinData);
      console.log('주보 로드 완료:', bulletinData.date);
    } else {
      console.error('주보를 불러올 수 없습니다.');
    }
  } catch (error) {
    console.error('주보 로드 중 오류:', error);
  }
  
  // 네비게이션 버튼 이벤트
  setupBulletinNavigation();
});

// 주보 네비게이션 설정
function setupBulletinNavigation() {
  const prevBtn = document.getElementById('prevBulletin');
  const nextBtn = document.getElementById('nextBulletin');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', async () => {
      const bulletinData = await bulletinLoader.loadPreviousBulletin();
      if (bulletinData) {
        bulletinRenderer.renderBulletin(bulletinData);
        // 페이지 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', async () => {
      const bulletinData = await bulletinLoader.loadNextBulletin();
      if (bulletinData) {
        bulletinRenderer.renderBulletin(bulletinData);
        // 페이지 상단으로 스크롤
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
}

// make navbar transparent when it is on the top
const navbar = document.querySelector("#navbar");
const navbarHeight = navbar.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  console.log(window.scrollY);
  console.log(`navbarHeight: ${navbarHeight}`);
  if (window.scrollY > navbarHeight) {
    navbar.classList.add("navbar--dark");
  } else {
    navbar.classList.remove("navbar--dark");
  }
});

//Navbar toggle button for small screen
const navbarToggleBtn = document.querySelector(".navbar__toggle-btn");
navbarToggleBtn.addEventListener("click", () => {
  navbarMenu.classList.toggle("open");
});

//Handle  scrolling when tapping on the navbar menu (클릭하면 움직이는 거)
const navbarMenu = document.querySelector(".navbar__menu");
document.addEventListener("click", event => {
  const target = event.target;
  const link = target.dataset.link;
  if (link == null) {
    return;
  }
  navbarMenu.classList.remove("open");

  console.log(event.target.dataset.link); // 이런작업이 왜 필요한진 모르겠는데, 여튼 엘리먼트 요소에 데이터 셋 없어서 언디파인드 나오는 애들 언디파인드 안나오게 하는 작업임
  //여기부터는 메뉴 누르면 해당 페이지로 스크롤 되는 기능

  const scrollTo = document.querySelector(link); // 여기서 고생함, 여기 링크값은 html의 데이터 값을 받아오는데, 데이터 값의 이름이랑 테그의 아이디값이 달라서 한동안 못가지고왔음 (대소문자 구별 잘해야함.)
  scrollTo.scrollIntoView({ behavior: "smooth" });
});

//contact me 버튼 클릭하면 글로 가는거 (혼자해봄) ---> 이미 위에 프로그래밍이 되어있어서, 걍 html문서에 버튼에다가 data-limk만 추가함. 바로됨
//Handle click on "cotact me" button on home (엘리는 걍 함수로 만들어버림)

const homeContactBtn = document.querySelector(".home__description");
homeContactBtn.addEventListener("click", () => {
  scrollIntoView("#contact");
}); // 이건 엘리쌤 작품임, 이렇게 하니까 갑자기 코드가 간편해짐?? ㅋㅋ

// Make home slowly fade to transparent as the window scrolls dow (home 화면 스크롤 하면 투명하게 바뀌는 거)
const home = document.querySelector("#home");
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener("scroll", () => {
  console.log(1 - window.scrollY / homeHeight);
  home.style.opacity = 1 - window.scrollY / homeHeight; //홈에 있는 스타일에 있는 오페시티값을 설정하는거 //
  // 그러니까 이런말인거 같다. 일단 쿼리셀렉터로 홈을 잡았다. 그리고 거기 안에 있는 스타일, 즉 id = home의 css값을 들어가서 거기서 opacity를 설정한거 같어
  //이게 된다는 말이지 참 ㅋㅋㅋ 재밌네
});

//arrow (누르면 위로 올라가는 화살표 만들기) --> 이건 내가 함 ㅋㅋ
const arrow = document.querySelector(".arrow");
arrow.addEventListener("click", () => {
  scrollIntoView("#home");
});

// footer 에서 교회로고 클릭하면 홈으로 가는 버튼 -> 밑에가면 화살표가 묻혀버려서 만들어야 함.
const footer_logo = document.querySelector(".contact_logo1_img");
footer_logo.addEventListener("click", () => {
  scrollIntoView("#home");
});

//show "arrow up" button scrolling down --> 이건 엘리쌤 도움 조금 받아서 함.
document.addEventListener("scroll", () => {
  if (window.scrollY > homeHeight / 2) {
    arrow.classList.add("visible");
  } else {
    arrow.classList.remove("visible");
  }
});

// Projects ---> 문제가 생김 누르면 처음에 걸러지다가 없어져 버림... (확인해서 조치합시다.) 지금 내 생각에는 아무래도 undifined 못 잡아서 이렇게 된거 같음.
// 문제 해결함, 아무래도 위의 자바스크립트 27줄에 있던 타겟 콘솔로그와 겹치면서 뭔가 에러가 난듯하다. 그거 지우고 다시 차근히 하니까 잘 되네...

const workBtnContainer = document.querySelector(".work__categories");
const ProjectContainer = document.querySelector(".work__projects");
const Projects = document.querySelectorAll(".project");
workBtnContainer.addEventListener("click", e => {
  const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter;
  if (filter == null) {
    return;
  }

  //Remove selection from the previous item and select the
  const active = document.querySelector(".category__btn.selected");
  active.classList.remove("selected");
  const target =
    e.target.nodeName === "BUTTON" ? e.target : e.target.parentNode;
  target.classList.add("selected");

  ProjectContainer.classList.add("anim-out");
  setTimeout(() => {
    Projects.forEach(project => {
      console.log(project.dataset.type);
      if (filter === "*" || filter === project.dataset.type) {
        project.classList.remove("invisible");
      } else {
        project.classList.add("invisible");
      }
    });
    ProjectContainer.classList.remove("anim-out");
  }, 300);

  // 이 밑의 코드는 잘 안되었던 코드이다. 나중에 차분히 보면서 혹시 여기에 문제가 있었는지 확인해봅시다. --> 이거 해결할려고 1시 넘어서 잠.
  // ProjectContainer.classList.add('anim-out');
  // Projects.forEach((project) => {
  //     console.log(project.dataset.type);
  //     if (filter === '*' || filter === project.dataset.type) {
  //         project.classList.remove('invisble');
  //     } else {
  //         project.classList.add('invisible');
  //     }

  //     setTimeout(() => {
  //         ProjectContainer.classList.remove('anim-out');
  //     },300);
  // });
});

function scrollIntoView(selector) {
  const scrollTo = document.querySelector(selector);
  scrollTo.scrollIntoView({ behavior: "smooth" });
} // 이건 모든 작업을 간편하게 하기 위한 함수
