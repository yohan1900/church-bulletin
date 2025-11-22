// bulletin-renderer.js
// JSON 데이터를 HTML로 렌더링

class BulletinRenderer {
  constructor() {}

  // 전체 주보 렌더링
  renderBulletin(bulletinData) {
    if (!bulletinData) {
      console.error('주보 데이터가 없습니다');
      return;
    }

    this.renderHeader(bulletinData);
    this.renderMorningWorship(bulletinData.morningWorship);
    this.renderEveningWorship(bulletinData.eveningWorship);
    this.renderWednesdayWorship(bulletinData.wednesdayWorship);
    this.renderDawnPrayer(bulletinData.dawnPrayer);
    this.renderPrayerTopics(bulletinData.prayerTopics);
    this.renderMemoryVerse(bulletinData.memoryVerse);
    this.renderAnnouncements(bulletinData.announcements);
    this.renderImages(bulletinData);
  }

  // 헤더 (제목, 날짜)
  renderHeader(data) {
    const titleEl = document.getElementById('bulletinTitle');
    if (titleEl) {
      titleEl.textContent = `제 ${data.volume} 권 ${data.issue} 호  ${this.formatDate(data.date)}`;
    }

    const eventTitleEl = document.getElementById('bulletinEventTitle');
    if (eventTitleEl && data.title) {
      eventTitleEl.textContent = data.title;
      eventTitleEl.style.display = 'block';
    } else if (eventTitleEl) {
      eventTitleEl.style.display = 'none';
    }
    
    // 네비게이션 버튼 상태 업데이트
    this.updateNavigationButtons();
  }
  
  // 네비게이션 버튼 상태 업데이트
  updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBulletin');
    const nextBtn = document.getElementById('nextBulletin');
    
    if (prevBtn) {
      prevBtn.disabled = !bulletinLoader.hasPrevious();
    }
    if (nextBtn) {
      nextBtn.disabled = !bulletinLoader.hasNext();
    }
  }

  // 날짜 포맷 변환 (2025-11-23 -> 2025, 11, 23)
  formatDate(dateStr) {
    const parts = dateStr.split('-');
    return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
  }

  // 주일 낮 예배
  renderMorningWorship(data) {
    if (!data) return;

    // 인도자
    const leaderEl = document.getElementById('morningLeader');
    if (leaderEl) {
      leaderEl.textContent = `인도: ${data.leader}`;
    }

    // 예배 순서 테이블
    const tbody = document.querySelector('#morningWorshipTable tbody');
    if (tbody) {
      tbody.innerHTML = '';
      
      data.order.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <th>${item.label}</th>
          <td>${item.content}</td>
        `;
        tbody.appendChild(row);
      });
    }

    // 다음주일 기도자
    const nextPrayerTable = document.querySelector('#nextPrayerTable tbody');
    if (nextPrayerTable && data.nextWeekPrayer) {
      nextPrayerTable.innerHTML = '';
      data.nextWeekPrayer.forEach(prayer => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <th>${prayer.part}</th>
          <td>${prayer.person}</td>
        `;
        nextPrayerTable.appendChild(row);
      });
    }

    // 예배위원
    const committeeTable = document.querySelector('#committeeTable tbody');
    const committeeMonth = document.getElementById('committeeMonth');
    if (committeeTable && data.worshipCommittee) {
      if (committeeMonth) {
        committeeMonth.textContent = `${data.worshipCommittee.month} 예배위원 안내`;
      }
      committeeTable.innerHTML = `
        <tr>
          <th>안내위원</th>
          <td>${data.worshipCommittee.ushers}</td>
        </tr>
        <tr>
          <th>헌금위원</th>
          <td>${data.worshipCommittee.offering}</td>
        </tr>
      `;
    }
  }

  // 주일 밤 예배
  renderEveningWorship(data) {
    const title = document.getElementById('eveningWorshipTitle');
    const info = document.getElementById('eveningWorshipInfo');
    const table = document.getElementById('eveningWorshipTable');
    
    if (!data || !data.enabled) {
      // 주일밤예배 섹션 숨기기
      if (title) title.style.display = 'none';
      if (info) info.style.display = 'none';
      if (table) table.style.display = 'none';
      return;
    }

    // 주일밤예배 표시
    if (title) title.style.display = 'block';
    if (info) {
      info.style.display = 'block';
      info.innerHTML = `
        <li>기도: ${data.prayer}${data.nextPrayer ? ` (다음 ${data.nextPrayer})` : ''}</li>
        ${data.special ? `<li>특송: ${data.special}${data.nextSpecial ? ` (다음 ${data.nextSpecial})` : ''}</li>` : ''}
      `;
    }
    
    if (table) {
      table.style.display = 'table';
      const tbody = table.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <th>성경</th>
            <td>${data.scripture}</td>
          </tr>
          <tr>
            <th>설교</th>
            <td>${data.sermon}</td>
          </tr>
          ${data.hymns && data.hymns.length > 0 ? `<tr><th>찬송</th><td>${data.hymns.join(', ')}</td></tr>` : ''}
        `;
      }
    }
  }

  // 수요 밤 예배
  renderWednesdayWorship(data) {
    const title = document.getElementById('wednesdayWorshipTitle');
    const info = document.getElementById('wednesdayWorshipInfo');
    const table = document.getElementById('wednesdayWorshipTable');
    
    if (!data || !data.enabled) {
      if (title) title.style.display = 'none';
      if (info) info.style.display = 'none';
      if (table) table.style.display = 'none';
      return;
    }

    if (title) title.style.display = 'block';
    if (info) info.style.display = 'block';
    
    if (table) {
      table.style.display = 'table';
      const tbody = table.querySelector('tbody');
      if (tbody) {
        tbody.innerHTML = `
          <tr>
            <th>성경</th>
            <td>${data.scripture}</td>
          </tr>
          <tr>
            <th>설교</th>
            <td>${data.sermon}</td>
          </tr>
        `;
      }
    }
  }

  // 새벽기도회
  renderDawnPrayer(data) {
    const title = document.getElementById('dawnPrayerTitle');
    const content = document.getElementById('dawnPrayerContent');
    
    if (!data || !data.enabled) {
      if (title) title.style.display = 'none';
      if (content) content.style.display = 'none';
      return;
    }

    if (title) {
      title.style.display = 'block';
      title.textContent = data.title || '새벽기도회 (얍복강 기도회)';
    }
    
    if (content) {
      content.style.display = 'block';
      content.innerHTML = `<li>${data.content}</li>`;
    }
  }

  // 기도제목
  renderPrayerTopics(topics) {
    if (!topics || topics.length === 0) return;

    const container = document.querySelector('#skills .skillset__left');
    if (!container) return;

    // 기존 기도제목 제거
    container.querySelectorAll('.skill').forEach(el => el.remove());

    // 새 기도제목 추가
    topics.forEach(topic => {
      const skillDiv = document.createElement('div');
      skillDiv.className = 'skill';
      skillDiv.innerHTML = `
        <div class="skill__description">
          <span>${topic}</span>
        </div>
        <div class="skill__bar">
          <div class="skill__value" style="width: 100%"></div>
        </div>
      `;
      container.appendChild(skillDiv);
      
      // <br> 태그 추가 (3번, 4번 뒤에만)
      if (topic.startsWith('3.') || topic.startsWith('4.')) {
        container.appendChild(document.createElement('br'));
      }
    });
  }

  // 암송말씀
  renderMemoryVerse(data) {
    if (!data) return;

    const descEl = document.getElementById('memoryVerseContent');
    if (descEl) {
      descEl.innerHTML = `
        <p>${data.text}</p>
        ${data.content ? `<p>${data.content}</p>` : ''}
        <p>${data.reference}</p>
      `;
    }
  }

  // 교회소식
  renderAnnouncements(announcements) {
    if (!announcements || announcements.length === 0) return;

    const ul = document.querySelector('.announcement-groups');
    if (!ul) return;

    ul.innerHTML = '';
    
    announcements.forEach(item => {
      const li = document.createElement('li');
      li.className = 'announcement-group';
      li.innerHTML = `
        <div class="announcement-number">${item.order}</div>
        <div class="announcement-content">${item.content}</div>
      `;
      ul.appendChild(li);
    });
  }

  // 이미지 렌더링 (구역보고, 봉헌)
  renderImages(data) {
    // JSON에 images 정보가 있을 때만 렌더링
    if (!data || !data.images) return;

    // 구역보고 이미지
    if (data.images.report) {
      const reportImg = `data/images/${data.images.report}`;
      this.loadImage(reportImg, 'regionReportImage', '구역보고');
    }

    // 봉헌 이미지
    if (data.images.offering) {
      const offeringImg = `data/images/${data.images.offering}`;
      this.loadImage(offeringImg, 'offeringImage', '봉헌 안내');
    }
  }

  // 이미지 로드 (존재 여부 체크)
  loadImage(imagePath, containerId, altText) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const img = new Image();
    
    img.onload = () => {
      container.innerHTML = `<img class="slogan-img" src="${imagePath}" alt="${altText}" />`;
      container.style.display = 'block';
    };
    
    img.onerror = () => {
      container.innerHTML = `<p style="text-align:center; color:#999;">이미지가 없습니다.</p>`;
      container.style.display = 'block';
    };
    
    img.src = imagePath;
  }
}

// 전역 인스턴스
const bulletinRenderer = new BulletinRenderer();
