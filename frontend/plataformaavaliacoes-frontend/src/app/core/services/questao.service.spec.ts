import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QuestaoService } from './questao.service';

describe('QuestaoService', () => {
  let service: QuestaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuestaoService]
    });
    service = TestBed.inject(QuestaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
