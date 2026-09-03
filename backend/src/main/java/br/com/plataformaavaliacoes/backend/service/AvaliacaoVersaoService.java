package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.model.Alternativa;
import br.com.plataformaavaliacoes.backend.domain.model.Avaliacao;
import br.com.plataformaavaliacoes.backend.domain.model.AvaliacaoQuestao;
import br.com.plataformaavaliacoes.backend.domain.model.AvaliacaoVersao;
import br.com.plataformaavaliacoes.backend.domain.model.BlocoQuestao;
import br.com.plataformaavaliacoes.backend.domain.model.GabaritoItem;
import br.com.plataformaavaliacoes.backend.domain.model.Questao;
import br.com.plataformaavaliacoes.backend.domain.repository.AvaliacaoQuestaoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.AvaliacaoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.AvaliacaoVersaoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.GabaritoItemRepository;
import br.com.plataformaavaliacoes.backend.dto.AvaliacaoVersaoResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.GabaritoItemResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.VersaoGeracaoRequestDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AvaliacaoVersaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final AvaliacaoQuestaoRepository avaliacaoQuestaoRepository;
    private final AvaliacaoVersaoRepository avaliacaoVersaoRepository;
    private final GabaritoItemRepository gabaritoItemRepository;
    private final GeradorCodigoService geradorCodigoService;
    private final ObjectMapper objectMapper;

    @Transactional
    public List<AvaliacaoVersaoResponseDTO> gerarVersoes(Long avaliacaoId, VersaoGeracaoRequestDTO request) {
        Avaliacao avaliacao = avaliacaoRepository.findById(avaliacaoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada"));

        List<AvaliacaoQuestao> avaliacaoQuestoes = avaliacaoQuestaoRepository.findByAvaliacaoIdOrderByOrdemAsc(avaliacaoId);

        List<AvaliacaoVersaoResponseDTO> respostas = new ArrayList<>();

        for (int i = 0; i < request.getQuantidadeVersoes(); i++) {
            List<Questao> questoesFinais = processarQuestoes(avaliacaoQuestoes, request.getEmbaralharQuestoes());

            AvaliacaoVersao versao = new AvaliacaoVersao();
            versao.setAvaliacao(avaliacao);
            versao.setCodigo(geradorCodigoService.gerarCodigoUnico());
            versao = avaliacaoVersaoRepository.save(versao);

            List<GabaritoItem> gabaritoItens = new ArrayList<>();
            int numeroQuestao = 1;

            for (Questao q : questoesFinais) {
                List<Alternativa> alternativas = new ArrayList<>(q.getAlternativas());
                if (Boolean.TRUE.equals(request.getEmbaralharAlternativas())) {
                    Collections.shuffle(alternativas);
                }

                GabaritoItem item = new GabaritoItem();
                item.setAvaliacaoVersao(versao);
                item.setQuestao(q);
                item.setNumeroQuestao(numeroQuestao++);

                List<Long> ordemAlternativas = new ArrayList<>();
                boolean achouCorreta = false;
                for (int j = 0; j < alternativas.size(); j++) {
                    Alternativa alt = alternativas.get(j);
                    ordemAlternativas.add(alt.getId());
                    if (alt.isCorreta()) {
                        item.setAlternativaCorretaOriginalId(alt.getId());
                        item.setLetraCorreta(String.valueOf((char) ('A' + j)));
                        achouCorreta = true;
                    }
                }

                if (!achouCorreta) {
                    throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "A questão " + q.getId() + " não possui uma alternativa correta definida.");
                }

                try {
                    item.setOrdemAlternativasJson(objectMapper.writeValueAsString(ordemAlternativas));
                } catch (JsonProcessingException e) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao serializar ordem das alternativas", e);
                }

                gabaritoItens.add(gabaritoItemRepository.save(item));
            }

            respostas.add(mapToResponseDTO(versao, gabaritoItens));
        }

        return respostas;
    }

    private List<Questao> processarQuestoes(List<AvaliacaoQuestao> avaliacaoQuestoes, boolean embaralhar) {
        Map<Long, List<Questao>> blocosMap = new LinkedHashMap<>();
        List<Questao> questoesSemBloco = new ArrayList<>();
        List<Object> ordemElementos = new ArrayList<>();

        for (AvaliacaoQuestao aq : avaliacaoQuestoes) {
            Questao q = aq.getQuestao();
            BlocoQuestao bloco = q.getBlocoQuestao();
            if (bloco != null) {
                if (!blocosMap.containsKey(bloco.getId())) {
                    blocosMap.put(bloco.getId(), new ArrayList<>());
                    ordemElementos.add(bloco.getId()); // Marcador de bloco
                }
                blocosMap.get(bloco.getId()).add(q);
            } else {
                questoesSemBloco.add(q);
                ordemElementos.add(q); // Marcador de questão sem bloco
            }
        }

        if (embaralhar) {
            Collections.shuffle(ordemElementos);
        }

        List<Questao> resultado = new ArrayList<>();
        for (Object elemento : ordemElementos) {
            if (elemento instanceof Long) { // É um ID de bloco
                resultado.addAll(blocosMap.get((Long) elemento));
            } else if (elemento instanceof Questao) {
                resultado.add((Questao) elemento);
            }
        }
        return resultado;
    }

    public AvaliacaoVersaoResponseDTO findByCodigo(String codigo) {
        AvaliacaoVersao versao = avaliacaoVersaoRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Versão não encontrada"));

        List<GabaritoItem> gabaritoItens = gabaritoItemRepository.findByAvaliacaoVersaoIdOrderByNumeroQuestaoAsc(versao.getId());

        return mapToResponseDTO(versao, gabaritoItens);
    }

    private AvaliacaoVersaoResponseDTO mapToResponseDTO(AvaliacaoVersao versao, List<GabaritoItem> gabaritoItens) {
        AvaliacaoVersaoResponseDTO dto = new AvaliacaoVersaoResponseDTO();
        dto.setId(versao.getId());
        dto.setCodigo(versao.getCodigo());
        dto.setCreatedAt(versao.getCreatedAt() != null ? versao.getCreatedAt() : null); // Fallback pois DB popula

        List<GabaritoItemResponseDTO> itensDto = new ArrayList<>();
        for (GabaritoItem item : gabaritoItens) {
            GabaritoItemResponseDTO itemDto = new GabaritoItemResponseDTO();
            itemDto.setNumeroQuestao(item.getNumeroQuestao());
            itemDto.setQuestaoId(item.getQuestao().getId());
            itemDto.setLetraCorreta(item.getLetraCorreta());
            itemDto.setOrdemAlternativasJson(item.getOrdemAlternativasJson());
            itensDto.add(itemDto);
        }
        dto.setGabarito(itensDto);
        return dto;
    }
}
