// step1 요구사항 구현을 위한 전략
// - [x] 에스프레소 메뉴에 엔터키 입력으로 추가한다.
// - [x] 에스프레소 메뉴에 새로운 메뉴를 확인 버튼으로 추가한다.
// -  추가되는 메뉴의 아래 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.


// - [x] 메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.
// - [x] 메뉴 수정시 브라우저에서 제공하는 `prompt` 인터페이스를 활용한다.

// - [x] 메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다
// - [x] 메뉴 삭제시 브라우저에서 제공하는 `confirm` 인터페이스를 활용한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.


// step2 요구사항 구현을 위한 전략
// - [x] localStorage에 데이터를 저장한다. write
// - [x] 메뉴를 추가할 때 저장
// - [x] 메뉴를 수정할 때 저장
// - [x] 메뉴를 삭제할 때 저장
// - [x] 새로고침해도 데이터가 남아있게 한다. -> 읽어온다. read

// - [x] 에스프레소, 프라푸치노, 블렌디드, 티바나, 디저트 각각의 종류별로 메뉴판을 관리할 수 있게 만든다.
// ->
//   [x] 에스프레소 메뉴판 관리
//   [x] 프라푸치노 메뉴판 관리
//   [x] 블렌디드 메뉴판 관리
//   [x] 티바나 메뉴판 관리
//   [x] 디저트 메뉴판 관리


// - [x] 페이지에 최초로 접근할 때는 에스프레소 메뉴가 먼저 보이게 한다.
// ->
//   로컬스토리지의 에스프레소 메뉴를 읽어온다. 에스프레소 메뉴를 페이지에 그린다.

// - [x] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 `sold-out` class를 추가하여 상태를 변경한다.
// - 품절 상태 메뉴의 마크업
// - [x] 품절 버튼을 추가한다.
// - [x] 품절 버튼을 클릭하면 localStorage에 상태값이 저장.
// - [x] 품절 해당메뉴의 상태값이 페이지에 그려진다.
// - [x] 클릭 이벤트에서 가장 가까운 li 태그의  class 속성 값에 sold-out을 추가한다.


// step3 요구사항 구현을 위한 전략

// - [x] [링크](https://github.com/blackcoffee-study/moonbucks-menu-server)에 있는 웹 서버 저장소를 clone하여 로컬에서 웹 서버를 실행시킨다
// - [x] 실제 서버에 데이터의 변경을 저장하는 형태로 리팩터링한다.
// ->
//   [x] 서버에 새로운 메뉴명이 추가될 수 있도록 요청한다.
//   [x] 서버에 카테고리별 메뉴리스트를 불러온다.
//   [x] 서버에 메뉴가 수정될 수 있도록 요청한다.
//   [x] 서버에 메뉴의 품절 상태가 토글될 수 있도록 요청한다.
//   [x] 서버에 메뉴가 삭제될 수 있도록 요청한다.

// 리팩터링 부분
// - [x] localStorage에 저장하는 로직은 지운다.
// - [x] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// 사용자 경험
// - [x] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 [alert](https://developer.mozilla.org/ko/docs/Web/API/Window/alert)으로 예외처리를 진행한다.
// - [x] 중복되는 메뉴는 추가할 수 없다.



import { $ } from './utils/dom.js';
// const $ = (selector) => document.querySelector(selector)
import menuApi from './api/index.js'
import store from './store/index.js'
// const store = {
//     setLocalStorage(menu) {
//         localStorage.setItem('menu', JSON.stringify(menu))
//     },
//     getLocalStorage() {
//         return JSON.parse(localStorage.getItem("menu"));
//     }
// }


function App() {

    // 상태 -> 변하는 데이터 : 갯수 - 메뉴명
    this.menu = {
        espresso: [],
        frappuccino: [],
        blended: [],
        teavana: [],
        desert: []
    };
    this.currentCategory = 'espresso';
    this.init = async () => {
        this.menu[this.currentCategory] = await menuApi.getAllMenuCategory(this.currentCategory);
        render();
        initEventListener();
    }

    const render = async () => {
        this.menu[this.currentCategory] = await menuApi.getAllMenuCategory(this.currentCategory)
        const template = this.menu[this.currentCategory].map(menuItem => {
            return `<li data-menu-id = "${menuItem.id}" class="${menuItem.isSoldOut ? 'sold-out' : ''} menu-list-item d-flex items-center py-2">
                <span class="w-100 pl-2 menu-name">${menuItem.name}</span>
                <button
                  type="button"
                  class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
                >
                  품절
                </button>
                <button
                  type="button"
                  class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
                >
                  수정
                </button>
                <button
                  type="button"
                  class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
                >
                  삭제
                </button>
              </li>`
        }).join("")
        const menu = $("#menu-list")
        // menu.insertAdjacentHTML('beforeend', template)
        menu.innerHTML = template
        updateMenuCount();
    }

    const updateMenuCount = () => {
        const menuCount = this.menu[this.currentCategory].length
        $('.menu-count').innerText = `총 ${menuCount}개`
    }

    const addMenuName = async () => {
        if ($("#menu-name").value === '') {
            alert('공백은 입력할 수 없습니다.')
            return;
        }
        const duplicatedItem = this.menu[this.currentCategory].find(menuItem => menuItem.name === $("#menu-name").value);
        if (duplicatedItem) {
            alert('이미 등록된 메뉴입니다. 다시 입력해주세요');
            $("#menu-name").value = '';
            return;
        }
        const menuName = $('#menu-name').value;
        await menuApi.createMenu(this.currentCategory, menuName)
        render();
        $("#menu-name").value = '';
        // this.menu[this.currentCategory].push({ name: menuName })
        // store.setLocalStorage(this.menu)
    }

    const updateMenuName = async (evt) => {
        const menuId = evt.target.closest('li').dataset.menuId
        const menuName = evt.target.parentElement.querySelector('span')
        const updatedMenuName = prompt('메뉴명을 수정하세요', menuName.innerText)
        // menuName.innerText = updatedMenuName;
        await menuApi.updateMenu(this.currentCategory, updatedMenuName, menuId)
        // this.menu[this.currentCategory][menuId].name = updatedMenuName;
        // store.setLocalStorage(this.menu)
        render();
    }

    const deleteMenuName = async (evt) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            const menuId = evt.target.closest('li').dataset.menuId;
            await menuApi.deleteMenu(this.currentCategory, menuId);
            render();
            // this.menu[this.currentCategory].splice(menuId, 1);
            // store.setLocalStorage(this.menu);
            // evt.target.parentElement.remove()
            // $('.menu-count').innerText = `총 ${this.querySelectorAll('li').length}개`
            // updateMenuCount();
        }
    }

    const soldOutMenu = async (evt) => {
        const menuId = evt.target.closest('li').dataset.menuId;
        await menuApi.soldOutToggle(this.currentCategory, menuId)
        // this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
        // store.setLocalStorage(this.menu);
        render();
    }

    const changeCategory = (evt) => {
        const categoryName = evt.target.dataset.categoryName;
        if (categoryName) {
            this.currentCategory = categoryName;
            $('#category-title').innerText = `${evt.target.innerText} 메뉴 관리`
            $('input').setAttribute('placeholder', `${evt.target.innerText} 메뉴 이름`)
            render();
        }
    }

    const initEventListener = () => {
        $('#menu-list').addEventListener('click', function (evt) {
            if (evt.target.classList.contains('menu-edit-button')) {
                updateMenuName(evt)
                return;
            }
            if (evt.target.classList.contains('menu-remove-button')) {
                deleteMenuName(evt);
                return;
            }
            if (evt.target.classList.contains('menu-sold-out-button')) {
                soldOutMenu(evt);
                return;
            }
        })

        $("#menu-form").addEventListener('submit', (evt) => {
            evt.preventDefault();
        })

        $('#menu-submit-button').addEventListener('click', addMenuName);


        $('#menu-name').addEventListener('keypress', (evt) => {
            if (evt.key !== 'Enter') return;
            addMenuName();
        })

        $('nav').addEventListener('click', changeCategory)
    }
}

const app = new App();

app.init();
