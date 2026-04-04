// bulletin-renderer.js
// JSON 데이터를 HTML로 렌더링

class BulletinRenderer {
  constructor() {
    // 이미지 로드 추적을 위한 타임스탬프
    this.imageLoadTimestamp = {
      regionReportImage: 0,
      offeringImage: 0
    };
  }

  // 전체 주보 렌더링
  renderBulletin(bulletinData) {
    if (!bulletinData) {
      console.error('주보 데이터가 없습니다');
      return;
    }

    // 먼저 이미지 컨테이너를 초기화 (비동기 로드 충돌 방지)
    this.clearImages();

    this.renderHeader(bulletinData);
    this.renderMorningWorship(bulletinData.morningWorship);
    this.renderEveningWorship(bulletinData.eveningWorship);
    this.renderWednesdayWorship(bulletinData.wednesdayWorship);
    this.renderDawnPrayer(bulletinData.dawnPrayer);
    this.renderPrayerTopics(bulletinData.prayerTopics);
    this.renderMemoryVerse(bulletinData.memoryVerse);
    this.renderAnnouncements(bulletinData.announcements);
    this.renderDistrictWorship(bulletinData.districtWorship);
    this.renderOfferings(bulletinData.offerings);
    this.renderImages(bulletinData);
  }

  // 이미지 컨테이너 초기화
  clearImages() {
    const offeringContainer = document.getElementById('offeringImage');
    const reportContainer = document.getElementById('regionReportImage');
    if (offeringContainer) {
      offeringContainer.innerHTML = '';
      offeringContainer.style.display = 'none';
    }
    if (reportContainer) {
      reportContainer.innerHTML = '';
      reportContainer.style.display = 'none';
    }
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
      if (title) title.style.display = 'none';
      if (info) info.style.display = 'none';
      if (table) table.style.display = 'none';
      return;
    }

    if (title) {
      title.style.display = 'block';
      title.textContent = '주일밤예배';
    }

    // 상단 요약 정보 — 연두색 띠에는 `info` 필드만 표시
    if (info) {
      if (data.info) {
        info.style.display = 'block';
        info.innerHTML = `<li style="color: #ffffff; font-weight: bold;">${data.info}</li>`;
      } else {
        info.style.display = 'none';
        info.innerHTML = '';
      }
    }

    // 상세 테이블 (가능한 모든 필드 표시)
    if (table) {
      const tbody = table.querySelector('tbody');
      if (!tbody) return;

      // 특별예배(장소 정보)가 있는 경우 장소/시간 표시
      if (data.location) {
        table.style.display = 'table';
        let locationRows = '';
        if (data.time) locationRows += `<tr><th>시간</th><td>${data.time}</td></tr>`;
        locationRows += `<tr><th>장소</th><td>${data.location}</td></tr>`;
        if (data.sermon) locationRows += `<tr><th>제목</th><td>${data.sermon}</td></tr>`;
        tbody.innerHTML = locationRows;
        return;
      }

      // 일반 예배 형태: 모든 가능한 행을 추가
      table.style.display = 'table';
      let rows = '';

      if (data.presider) rows += `<tr><th>사회</th><td>${data.presider}</td></tr>`;
      if (data.prayer) rows += `<tr><th>기도</th><td>${data.prayer}${data.nextPrayer ? ` (다음: ${data.nextPrayer})` : ''}</td></tr>`;
      if (data.scripture) rows += `<tr><th>성경</th><td>${data.scripture}</td></tr>`;
      if (data.sermon) rows += `<tr><th>설교</th><td>${data.sermon}</td></tr>`;

      if (data.special) {
        let specialHtml = `${data.special}`;
        if (data.specialList && data.specialList.length > 0) {
          specialHtml += `<br/><small>${data.specialList.join(', ')}</small>`;
        }
        rows += `<tr><th>특송</th><td>${specialHtml}</td></tr>`;
      }

      if (data.offering) rows += `<tr><th>헌금</th><td>${data.offering}</td></tr>`;
      if (data.commitment) rows += `<tr><th>다짐</th><td>${data.commitment}</td></tr>`;
      if (data.announcer) rows += `<tr><th>광고</th><td>${data.announcer}</td></tr>`;
      if (data.hymns && data.hymns.length > 0) rows += `<tr><th>찬송</th><td>${data.hymns.join(', ')}</td></tr>`;
      if (data.benediction) rows += `<tr><th>축도</th><td>${data.benediction}</td></tr>`;

      tbody.innerHTML = rows || `<tr><td colspan="2">주일밤예배 정보가 없습니다.</td></tr>`;
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
    }    if (title) title.style.display = 'block';
    
    // 예배시간 및 특별행사 정보 표시
    if (info) {
      info.style.display = 'block';
      let infoHTML = '';
        // 특별행사(송구영신예배 등)가 있으면 표시
      if (data.info) {
        infoHTML += `<li style="color: #ffffff; font-weight: bold;">${data.info}</li>`;
        // sermon이 시간 정보면 추가 표시
        if (data.sermon && !data.scripture) {
          infoHTML += `<li>${data.sermon}</li>`;
        }
      } else {
        // 일반 수요예배는 예배시간 표시
        infoHTML += `<li style="color: #ffffff; font-weight: bold;">예배시간: 오후 7시 30분</li>`;
      }
      
      info.innerHTML = infoHTML;
    }
    
    // 성경이 있을 때만 테이블 표시
    if (table) {
      if (data.scripture) {
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
      } else {
        // 특별행사(송구영신예배 등)일 경우 테이블 숨김
        table.style.display = 'none';
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
    const container = document.querySelector('#skills .skillset__left');
    if (!container) return;

    // 기존 기도제목 제거 (주석 뒤의 모든 skill 요소들)
    const comment = Array.from(container.childNodes).find(
      node => node.nodeType === Node.COMMENT_NODE && node.textContent.includes('동적으로 렌더링')
    );
    if (comment) {
      let next = comment.nextSibling;
      while (next) {
        const current = next;
        next = next.nextSibling;
        if (current.classList && current.classList.contains('skill')) {
          current.remove();
        } else if (current.nodeName === 'BR') {
          current.remove();
        }
      }
    }

    // 기도제목이 없으면 종료
    if (!topics || topics.length === 0) return;

    // 새 기도제목 추가
    topics.forEach((topic, index) => {
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
      
      // <br> 태그 추가 (항목 사이)
      if (index < topics.length - 1) {
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
  // 구역예배 렌더링
  renderDistrictWorship(data) {
    const container = document.getElementById('districtWorshipTable');
    if (!container) return;

    if (!data || !data.enabled || !data.reports || data.reports.length === 0) {
      container.innerHTML = '';
      return;
    }

    let html = '<table class="district-table"><thead><tr>';
    html += '<th>장소</th><th>인원</th><th>헌금</th><th>성경</th><th>다음장소</th>';
    html += '</tr></thead><tbody>';

    data.reports.forEach(report => {
      html += '<tr>';
      html += `<td>${report.district}</td>`;
      html += `<td>${report.attendance}</td>`;
      html += `<td>${report.offering.toLocaleString()}</td>`;
      html += `<td>${report.scripture}</td>`;
      html += `<td>${report.nextLeader}</td>`;
      html += '</tr>';
    });

    html += '</tbody></table>';
    container.innerHTML = html;
  }

  // 봉헌 렌더링
  renderOfferings(data) {
    const container = document.getElementById('offeringTable');
    if (!container) return;

    if (!data) {
      container.innerHTML = '';
      return;
    }

    let html = '<div class="offerings-container">';
    
    // 십일조
    if (data.tithe && data.tithe.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>십일조</h3>';
      html += '<p>' + data.tithe.join(', ') + '</p>';
      html += '</div>';
    }

    // 천 번제
    if (data.thousandOffer && data.thousandOffer.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>일천번제</h3>';
      html += '<p>' + data.thousandOffer.join(', ') + '</p>';
      html += '</div>';
    }

    // 감사헌금
    if (data.thanks && data.thanks.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>감사헌금</h3>';
      html += '<p>' + data.thanks.join(', ') + '</p>';
      html += '</div>';
    }

    // 심방감사
    if (data.visitThanks && data.visitThanks.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>심방감사</h3>';
      html += '<p>' + data.visitThanks.join(', ') + '</p>';
      html += '</div>';
    }

    // 부활감사
    if (data.resurrectionThanks && data.resurrectionThanks.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>부활감사</h3>';
      html += '<p>' + data.resurrectionThanks.join(', ') + '</p>';
      html += '</div>';
    }

    // 생일감사
    if (data.birthday && data.birthday.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>생일감사</h3>';
      html += '<p>' + data.birthday.join(', ') + '</p>';
      html += '</div>';
    }

    // 월삭헌금
    if (data.monthly && data.monthly.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>월삭헌금</h3>';
      html += '<p>' + data.monthly.join(', ') + '</p>';
      html += '</div>';
    }

    // 건축헌금
    if (data.building && data.building.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>건축헌금</h3>';
      html += '<p>' + data.building.join(', ') + '</p>';
      html += '</div>';
    }

    // 선교헌금
    if (data.mission && data.mission.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>선교헌금</h3>';
      html += '<p>' + data.mission.join(', ') + '</p>';
      html += '</div>';
    }

    // 어린이선교
    if (data.childrenMission && data.childrenMission.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>어린이선교</h3>';
      html += '<p>' + data.childrenMission.join(', ') + '</p>';
      html += '</div>';
    }

    // 장학헌금
    if (data.scholarship && data.scholarship.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>장학헌금</h3>';
      html += '<p>' + data.scholarship.join(', ') + '</p>';
      html += '</div>';
    }

    // 구제헌금
    if (data.relief && data.relief.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>구제헌금</h3>';
      html += '<p>' + data.relief.join(', ') + '</p>';
      html += '</div>';
    }

    // 꽃꽂이
    if (data.flowers && data.flowers.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>꽃꽂이</h3>';
      html += '<p>' + data.flowers.join(', ') + '</p>';
      html += '</div>';
    }

    // 새생명축제
    if (data.newLifeFestival && data.newLifeFestival.length > 0) {
      html += '<div class="offering-section">';
      html += '<h3>새생명축제</h3>';
      html += '<p>' + data.newLifeFestival.join(', ') + '</p>';
      html += '</div>';
    }

    html += '</div>';
    
    // 데이터가 있으면 표 표시, 없으면 숨김
    if (html.includes('offering-section')) {
      container.innerHTML = html;
    } else {
      container.innerHTML = '';
    }
  }

  renderImages(data) {
    // 이미지 컨테이너 참조
    const offeringContainer = document.getElementById('offeringImage');
    const reportContainer = document.getElementById('regionReportImage');

    // JSON에 images 정보가 없으면 조기 종료 (clearImages에서 이미 초기화됨)
    if (!data || !data.images) {
      return;
    }

    // 구역보고 이미지 - null이 아니고 유효한 파일명일 때만 로드
    if (data.images.report && typeof data.images.report === 'string') {
      const reportImg = `data/images/${data.images.report}`;
      this.loadImage(reportImg, 'regionReportImage', '구역보고');
    } else {
      // report가 없으면 타임스탬프를 즉시 업데이트 (이전 비동기 요청 무효화)
      this.imageLoadTimestamp['regionReportImage'] = Date.now();
    }

    // 봉헌 이미지 - null이 아니고 유효한 파일명일 때만 로드
    if (data.images.offering && typeof data.images.offering === 'string') {
      const offeringImg = `data/images/${data.images.offering}`;
      this.loadImage(offeringImg, 'offeringImage', '봉헌 안내');
    } else {
      // offering이 없으면 타임스탬프를 즉시 업데이트 (이전 비동기 요청 무효화)
      this.imageLoadTimestamp['offeringImage'] = Date.now();
    }
  }

  // 이미지 로드 (존재 여부 체크)
  loadImage(imagePath, containerId, altText) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 현재 요청의 타임스탬프 설정
    const requestTimestamp = Date.now();
    this.imageLoadTimestamp[containerId] = requestTimestamp;

    const img = new Image();
    
    img.onload = () => {
      // 이 요청이 가장 최신 요청인지 확인
      if (this.imageLoadTimestamp[containerId] !== requestTimestamp) {
        return; // 더 이상 유효하지 않은 요청이므로 무시
      }
      
      container.innerHTML = `<img class="slogan-img" src="${imagePath}" alt="${altText}" />`;
      container.style.display = 'block';
    };
    
    img.onerror = () => {
      // 이 요청이 가장 최신 요청인지 확인
      if (this.imageLoadTimestamp[containerId] !== requestTimestamp) {
        return; // 더 이상 유효하지 않은 요청이므로 무시
      }

      // 이미지가 없으면 컨테이너 비우기 (JSON 데이터 표시를 위해)
      container.innerHTML = '';
      container.style.display = 'none';
    };
    
    img.src = imagePath;
  }
}

// 전역 인스턴스
const bulletinRenderer = new BulletinRenderer();
