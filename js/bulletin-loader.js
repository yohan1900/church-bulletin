// bulletin-loader.js
// JSON 파일을 불러오는 로더

class BulletinLoader {
  constructor() {
    this.currentBulletin = null;
    this.bulletinList = [];
    this.currentIndex = 0;
  }

  // 특정 날짜의 주보 불러오기
  async loadBulletin(date) {
    try {
      const response = await fetch(`data/bulletins/${date}.json`);
      if (!response.ok) {
        throw new Error(`주보를 찾을 수 없습니다: ${date}`);
      }
      this.currentBulletin = await response.json();
      return this.currentBulletin;
    } catch (error) {
      console.error('주보 로드 실패:', error);
      return null;
    }
  }

  // 최신 주보 불러오기 (가장 최근 날짜)
  async loadLatestBulletin() {
    try {
      const response = await fetch('data/bulletins.json');
      if (!response.ok) {
        // bulletins.json이 없으면 기본값 사용
        return await this.loadBulletin('2025-11-23');
      }
      
      this.bulletinList = await response.json();
      if (this.bulletinList.length === 0) {
        throw new Error('주보 목록이 비어있습니다');
      }

      // 날짜순 정렬 후 최신 주보
      this.bulletinList.sort((a, b) => new Date(b.date) - new Date(a.date));
      this.currentIndex = 0;
      const latestDate = this.bulletinList[0].date;
      
      return await this.loadBulletin(latestDate);
    } catch (error) {
      console.error('최신 주보 로드 실패:', error);
      // 폴백: 기본 날짜 시도
      return await this.loadBulletin('2025-11-23');
    }
  }

  // 이전 주보 불러오기
  async loadPreviousBulletin() {
    if (this.bulletinList.length === 0) {
      await this.getBulletinList();
    }
    
    if (this.currentIndex < this.bulletinList.length - 1) {
      this.currentIndex++;
      const date = this.bulletinList[this.currentIndex].date;
      return await this.loadBulletin(date);
    }
    return null;
  }

  // 다음 주보 불러오기
  async loadNextBulletin() {
    if (this.bulletinList.length === 0) {
      await this.getBulletinList();
    }
    
    if (this.currentIndex > 0) {
      this.currentIndex--;
      const date = this.bulletinList[this.currentIndex].date;
      return await this.loadBulletin(date);
    }
    return null;
  }

  // 이전 주보가 있는지 확인
  hasPrevious() {
    return this.currentIndex < this.bulletinList.length - 1;
  }

  // 다음 주보가 있는지 확인
  hasNext() {
    return this.currentIndex > 0;
  }

  // 모든 주보 목록 가져오기
  async getBulletinList() {
    try {
      const response = await fetch('data/bulletins.json');
      if (!response.ok) {
        this.bulletinList = [{
          date: '2025-11-23',
          volume: '5',
          issue: '47',
          title: ''
        }];
        return this.bulletinList;
      }
      this.bulletinList = await response.json();
      this.bulletinList.sort((a, b) => new Date(b.date) - new Date(a.date));
      return this.bulletinList;
    } catch (error) {
      console.error('주보 목록 로드 실패:', error);
      return [];
    }
  }
}

// 전역 인스턴스
const bulletinLoader = new BulletinLoader();
