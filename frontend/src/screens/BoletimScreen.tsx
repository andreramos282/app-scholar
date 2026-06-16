import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { API_ROUTES } from '../services/apiConfig';
import { colors, spacing, radius, fontSize } from '../styles/theme';

type TipoProva = 'A' | 'B' | 'C';

interface CursoItem {
  id?: number;
  nome: string;
  periodo?: string;
}

interface DisciplinaItem {
  id: number;
  nome: string;
  carga_horaria?: number;
  professor_id?: number;
  curso: string;
  semestre: number;
  periodo?: string;
  professor_nome?: string;
}

interface AlunoItem {
  matricula: string;
  nome: string;
  curso: string;
  semestre: number;
  periodo?: string;
}

interface BoletimItem {
  id?: number;
  aluno_matricula: string;
  aluno_nome?: string;
  aluno_curso?: string;
  aluno_semestre?: number;
  aluno_periodo?: string;
  disciplina_id: number;
  disciplina_nome: string;
  disciplina_curso?: string;
  disciplina_semestre?: number;
  periodo?: string;
  professor_id?: number;
  professor_nome?: string;
  nota1?: number | null;
  nota2?: number | null;
  tipo_prova?: TipoProva;
  faltas?: number | null;
  aulas_totais?: number | null;
  frequencia?: number | null;
  media?: number | null;
  situacao?: string;
}

const parseDecimal = (value: string) => Number(String(value || '').replace(',', '.'));
const notaLabel = (value?: number | null) => value === null || value === undefined ? '-' : Number(value).toFixed(1);
const pctLabel = (value?: number | null) => value === null || value === undefined ? '-' : `${Number(value).toFixed(1)}%`;
const normalizarLista = (data: any): any[] => Array.isArray(data) ? data : (Array.isArray(data?.response) ? data.response : []);
const mesmoTexto = (a?: string, b?: string) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();

export const BoletimScreen = () => {
  const { token, user } = useAuth();
  const [boletim, setBoletim] = useState<BoletimItem[]>([]);
  const [cursos, setCursos] = useState<CursoItem[]>([]);
  const [disciplinas, setDisciplinas] = useState<DisciplinaItem[]>([]);
  const [alunos, setAlunos] = useState<AlunoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [busca, setBusca] = useState('');

  const [cursoSelecionado, setCursoSelecionado] = useState('');
  const [disciplinaId, setDisciplinaId] = useState<number>(0);
  const [matricula, setMatricula] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [tipoProva, setTipoProva] = useState<TipoProva>('A');
  const [faltas, setFaltas] = useState('0');
  const [aulasTotais, setAulasTotais] = useState('80');

  const isAluno = user?.perfil === 'aluno';
  const isProfessor = user?.perfil === 'professor';
  const isAdmin = user?.perfil === 'admin';
  const canEdit = isProfessor || isAdmin;

 const carregar = async () => {
  try {
    setLoading(true);

    if (isAluno) {
      const mat = String((user as any)?.matricula || user?.id);
      const bolRes = await api.get<BoletimItem[]>(
        API_ROUTES.BOLETIM_BY_ALUNO(mat),
        token || undefined
      );

      setBoletim(normalizarLista(bolRes));
      setCursos([]);
      setDisciplinas([]);
      setAlunos([]);
      setMatricula(mat);
      return;
    }

    const professorId = Number(user?.id);

    const cursoRes = await api
      .get<any>(API_ROUTES.CURSOS, token || undefined)
      .catch((error) => {
        console.log("Erro ao carregar cursos no boletim:", error);
        return { response: [] };
      });

    const alunoRes = await api
      .get<any>(API_ROUTES.ALUNOS, token || undefined)
      .catch((error) => {
        console.log("Erro ao carregar alunos no boletim:", error);
        return { response: [] };
      });

    const disciplinaRes = await (
      isProfessor
        ? api.get<any>(
            API_ROUTES.PROFESSOR_DISCIPLINAS(professorId),
            token || undefined
          )
        : api.get<any>(API_ROUTES.DISCIPLINAS, token || undefined)
    ).catch((error) => {
      console.log("Erro ao carregar disciplinas no boletim:", error);
      return { response: [] };
    });

    const boletimRes = await (
      isProfessor
        ? api.get<any>(
            API_ROUTES.PROFESSOR_BOLETIM(professorId),
            token || undefined
          )
        : api.get<any>(API_ROUTES.BOLETIM, token || undefined)
    ).catch((error) => {
      console.log("Erro ao carregar boletins:", error);
      return [];
    });

    setCursos(normalizarLista(cursoRes));
    setAlunos(normalizarLista(alunoRes));
    setDisciplinas(normalizarLista(disciplinaRes));
    setBoletim(normalizarLista(boletimRes));
  } catch (error: any) {
    Alert.alert(
      "Erro",
      error.message ||
        "Não foi possível carregar os dados do boletim. Confira se o backend está rodando."
    );
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => { carregar(); }, [user?.id, user?.perfil]);

  const cursosDisponiveis = useMemo(() => {
    const nomes = new Set<string>();
    cursos.forEach((c) => c.nome && nomes.add(c.nome));
    disciplinas.forEach((d) => d.curso && nomes.add(d.curso));
    alunos.forEach((a) => a.curso && nomes.add(a.curso));
    return Array.from(nomes).sort((a, b) => a.localeCompare(b));
  }, [cursos, disciplinas, alunos]);

  const disciplinasDoCurso = useMemo(() => {
    if (!cursoSelecionado) return [];
    return disciplinas
      .filter((d) => mesmoTexto(d.curso, cursoSelecionado))
      .sort((a, b) => (a.semestre - b.semestre) || a.nome.localeCompare(b.nome));
  }, [disciplinas, cursoSelecionado]);

  const disciplinaSelecionada = useMemo(() => {
    return disciplinas.find((d) => Number(d.id) === Number(disciplinaId));
  }, [disciplinas, disciplinaId]);

  const alunosDaSelecao = useMemo(() => {
    if (!cursoSelecionado) return [];
    const porCurso = alunos.filter((a) => mesmoTexto(a.curso, cursoSelecionado));
    if (!disciplinaSelecionada) return porCurso.sort((a, b) => a.nome.localeCompare(b.nome));

    const mesmoCursoSemestre = porCurso.filter((a) => Number(a.semestre) === Number(disciplinaSelecionada.semestre));
    const mesmoCursoSemestrePeriodo = mesmoCursoSemestre.filter((a) => !disciplinaSelecionada.periodo || !a.periodo || mesmoTexto(a.periodo, disciplinaSelecionada.periodo));

    const listaFinal = mesmoCursoSemestrePeriodo.length > 0 ? mesmoCursoSemestrePeriodo : (mesmoCursoSemestre.length > 0 ? mesmoCursoSemestre : porCurso);
    return listaFinal.sort((a, b) => a.nome.localeCompare(b.nome));
  }, [alunos, cursoSelecionado, disciplinaSelecionada]);

  const itemSelecionado = useMemo(() => {
    if (!matricula || !disciplinaId) return undefined;
    return boletim.find((b) => b.aluno_matricula === matricula && Number(b.disciplina_id) === Number(disciplinaId));
  }, [boletim, matricula, disciplinaId]);

  const boletimFiltrado = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return boletim;
    return boletim.filter((item) => `${item.aluno_matricula} ${item.aluno_nome} ${item.disciplina_nome} ${item.aluno_curso} ${item.disciplina_curso} ${item.professor_nome}`.toLowerCase().includes(termo));
  }, [boletim, busca]);

  const frequenciaCalculada = useMemo(() => {
    const faltasNumber = Number(faltas.replace(',', '.'));
    const aulasNumber = Number(aulasTotais.replace(',', '.'));
    if (!Number.isFinite(faltasNumber) || !Number.isFinite(aulasNumber) || aulasNumber <= 0) return 100;
    return Math.max(0, Math.min(100, ((aulasNumber - faltasNumber) / aulasNumber) * 100));
  }, [faltas, aulasTotais]);

  const mediaPreview = useMemo(() => {
    const n1 = parseDecimal(nota1);
    const n2 = parseDecimal(nota2);
    if (!Number.isFinite(n1) || !Number.isFinite(n2)) return null;
    return (n1 + n2) / 2;
  }, [nota1, nota2]);

  const situacaoPreview = useMemo(() => {
    if (frequenciaCalculada < 75) return 'Reprovado por falta';
    if (mediaPreview === null) return 'Aguardando notas';
    return mediaPreview >= 6 ? 'Aprovado' : 'Reprovado por nota';
  }, [frequenciaCalculada, mediaPreview]);

  const resumo = useMemo(() => {
    const lancados = boletim.filter((b) => b.nota1 !== null && b.nota1 !== undefined).length;
    const aprovados = boletim.filter((b) => (b.situacao || '').toLowerCase().includes('aprovado')).length;
    const reprovadosFalta = boletim.filter((b) => (b.situacao || '').toLowerCase().includes('falta')).length;
    return { total: boletim.length, lancados, aprovados, reprovadosFalta };
  }, [boletim]);

  const preencherDoItem = (item: BoletimItem) => {
    const cursoDoItem = item.disciplina_curso || item.aluno_curso || '';
    setCursoSelecionado(cursoDoItem);
    setDisciplinaId(Number(item.disciplina_id));
    setMatricula(item.aluno_matricula || '');
    setNota1(item.nota1 === null || item.nota1 === undefined ? '' : String(item.nota1));
    setNota2(item.nota2 === null || item.nota2 === undefined ? '' : String(item.nota2));
    setTipoProva(item.tipo_prova || 'A');
    setFaltas(String(item.faltas ?? 0));
    setAulasTotais(String(item.aulas_totais && item.aulas_totais > 0 ? item.aulas_totais : 80));
  };

  useEffect(() => {
    if (itemSelecionado) {
      setNota1(itemSelecionado.nota1 === null || itemSelecionado.nota1 === undefined ? '' : String(itemSelecionado.nota1));
      setNota2(itemSelecionado.nota2 === null || itemSelecionado.nota2 === undefined ? '' : String(itemSelecionado.nota2));
      setTipoProva(itemSelecionado.tipo_prova || 'A');
      setFaltas(String(itemSelecionado.faltas ?? 0));
      setAulasTotais(String(itemSelecionado.aulas_totais && itemSelecionado.aulas_totais > 0 ? itemSelecionado.aulas_totais : 80));
    } else if (disciplinaId && matricula) {
      setNota1('');
      setNota2('');
      setTipoProva('A');
      setFaltas('0');
      setAulasTotais(String(disciplinaSelecionada?.carga_horaria || 80));
    }
  }, [itemSelecionado?.id, disciplinaId, matricula]);

  const selecionarCurso = (curso: string) => {
    setCursoSelecionado(curso);
    setDisciplinaId(0);
    setMatricula('');
    setNota1('');
    setNota2('');
    setTipoProva('A');
    setFaltas('0');
    setAulasTotais('80');
  };

  const selecionarDisciplina = (id: number) => {
    setDisciplinaId(id);
    setMatricula('');
    setNota1('');
    setNota2('');
    setTipoProva('A');
    setFaltas('0');
    const disciplina = disciplinas.find((d) => Number(d.id) === Number(id));
    setAulasTotais(String(disciplina?.carga_horaria || 80));
  };

  const limpar = () => {
    setCursoSelecionado('');
    setDisciplinaId(0);
    setMatricula('');
    setNota1('');
    setNota2('');
    setTipoProva('A');
    setFaltas('0');
    setAulasTotais('80');
  };

  const salvar = async () => {
    const n1 = parseDecimal(nota1);
    const n2 = parseDecimal(nota2);
    const f = Number(faltas.replace(',', '.'));
    const aulas = Number(aulasTotais.replace(',', '.'));

    if (!cursoSelecionado) return Alert.alert('Atenção', 'Selecione o curso primeiro.');
    if (!disciplinaId) return Alert.alert('Atenção', 'Selecione a disciplina/matéria.');
    if (!matricula.trim()) return Alert.alert('Atenção', 'Selecione o aluno.');
    if (!Number.isFinite(n1) || !Number.isFinite(n2) || n1 < 0 || n1 > 10 || n2 < 0 || n2 > 10) return Alert.alert('Notas inválidas', 'As notas devem ficar entre 0 e 10.');
    if (!Number.isFinite(f) || !Number.isFinite(aulas) || f < 0 || aulas <= 0 || f > aulas) return Alert.alert('Frequência inválida', 'Informe aulas totais maior que 0 e faltas entre 0 e aulas totais.');

    try {
      setSaving(true);
      await api.post(API_ROUTES.BOLETIM, {
        aluno_matricula: matricula.trim(),
        disciplina_id: disciplinaId,
        nota1: n1,
        nota2: n2,
        tipo_prova: tipoProva,
        faltas: Math.floor(f),
        aulas_totais: Math.floor(aulas),
        frequencia: Number(frequenciaCalculada.toFixed(2)),
      }, token || undefined);
      await carregar();
      Alert.alert('Sucesso', 'Boletim e frequência salvos com sucesso.');
    } catch (error: any) {
      Alert.alert('Erro ao salvar', error.message || 'Não foi possível salvar. Confira se aluno, curso e disciplina estão cadastrados corretamente.');
    } finally {
      setSaving(false);
    }
  };

  const situacaoColor = (situacao?: string) => {
    const s = (situacao || '').toLowerCase();
    if (s.includes('aprovado')) return colors.success;
    if (s.includes('reprovado')) return colors.danger;
    return colors.textSecondary;
  };

  if (loading) return <Loading message="Carregando boletins..." />;

  return (
    <View style={styles.flex}>
      <Header title={isAluno ? 'Meu Boletim' : 'Boletins'} showBack />
      <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregar(); }} />}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{isAluno ? 'Seu desempenho acadêmico' : 'Lançamento de boletim'}</Text>
          <Text style={styles.heroSub}>{isProfessor ? 'Fluxo: escolha o curso, depois a disciplina e por último o aluno. Você lança apenas matérias vinculadas a você.' : isAdmin ? 'Fluxo organizado para evitar lançar nota na matéria errada.' : 'Acompanhe suas matérias, notas e frequência.'}</Text>
          <View style={styles.kpiRow}>
            <View style={styles.kpi}><Text style={styles.kpiValue}>{resumo.total}</Text><Text style={styles.kpiLabel}>registros</Text></View>
            <View style={styles.kpi}><Text style={styles.kpiValue}>{resumo.lancados}</Text><Text style={styles.kpiLabel}>lançados</Text></View>
            <View style={styles.kpi}><Text style={styles.kpiValue}>{resumo.aprovados}</Text><Text style={styles.kpiLabel}>aprovados</Text></View>
            <View style={styles.kpi}><Text style={styles.kpiValue}>{resumo.reprovadosFalta}</Text><Text style={styles.kpiLabel}>por falta</Text></View>
          </View>
        </View>

        {canEdit && (
          <View style={styles.panel}>
            <Text style={styles.sectionTitle}>Novo lançamento</Text>
            <Text style={styles.helper}>Ordem correta: 1) Curso  2) Disciplina  3) Aluno  4) Notas/Frequência.</Text>

            <View style={styles.stepBadge}><Text style={styles.stepText}>1. Curso</Text></View>
            <View style={styles.pickerBox}>
              <Text style={styles.pickerLabel}>Curso *</Text>
              <Picker selectedValue={cursoSelecionado} onValueChange={(value) => selecionarCurso(String(value))} style={styles.picker}>
                <Picker.Item label="Selecione um curso" value="" />
                {cursosDisponiveis.map((curso) => <Picker.Item key={curso} label={curso} value={curso} />)}
              </Picker>
              {cursosDisponiveis.length === 0 ? <Text style={styles.warnText}>Cadastre cursos, alunos e disciplinas para liberar o lançamento.</Text> : null}
            </View>

            <View style={styles.stepBadge}><Text style={styles.stepText}>2. Disciplina</Text></View>
            <View style={styles.pickerBox}>
              <Text style={styles.pickerLabel}>Disciplina / matéria *</Text>
              <Picker selectedValue={disciplinaId || 0} onValueChange={(value) => selecionarDisciplina(Number(value))} style={styles.picker} enabled={!!cursoSelecionado}>
                <Picker.Item label={cursoSelecionado ? 'Selecione a disciplina' : 'Selecione um curso primeiro'} value={0} />
                {disciplinasDoCurso.map((d) => <Picker.Item key={d.id} label={`${d.nome} • ${d.semestre}º semestre • ${d.periodo || 'Período não informado'}`} value={d.id} />)}
              </Picker>
              {cursoSelecionado && disciplinasDoCurso.length === 0 ? <Text style={styles.warnText}>Nenhuma disciplina cadastrada para esse curso.</Text> : null}
            </View>

            <View style={styles.stepBadge}><Text style={styles.stepText}>3. Aluno</Text></View>
            <View style={styles.pickerBox}>
              <Text style={styles.pickerLabel}>Aluno *</Text>
              <Picker selectedValue={matricula} onValueChange={(value) => setMatricula(String(value))} style={styles.picker} enabled={!!disciplinaId}>
                <Picker.Item label={disciplinaId ? 'Selecione o aluno' : 'Selecione uma disciplina primeiro'} value="" />
                {alunosDaSelecao.map((a) => <Picker.Item key={a.matricula} label={`${a.nome} • ${a.matricula} • ${a.semestre}º ${a.periodo || ''}`} value={a.matricula} />)}
              </Picker>
              {disciplinaId && alunosDaSelecao.length === 0 ? <Text style={styles.warnText}>Nenhum aluno encontrado para esse curso. Verifique se o aluno foi cadastrado com o curso correto.</Text> : null}
            </View>

            {disciplinaSelecionada ? (
              <View style={styles.selectedCard}>
                <Text style={styles.selectedTitle}>{disciplinaSelecionada.nome}</Text>
                <Text style={styles.selectedSub}>Curso: {disciplinaSelecionada.curso} • {disciplinaSelecionada.semestre}º semestre • {disciplinaSelecionada.periodo || 'Período não informado'}</Text>
              </View>
            ) : null}

            <View style={styles.stepBadge}><Text style={styles.stepText}>4. Notas e frequência</Text></View>
            <View style={styles.tipoRow}>
              {(['A', 'B', 'C'] as TipoProva[]).map((tipo) => (
                <TouchableOpacity key={tipo} style={[styles.tipoButton, tipoProva === tipo && styles.tipoButtonActive]} onPress={() => setTipoProva(tipo)}>
                  <Text style={[styles.tipoButtonText, tipoProva === tipo && styles.tipoButtonTextActive]}>Prova {tipo}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.formRow}>
              <TextInput style={styles.inputHalf} keyboardType="numeric" placeholder="Nota 1" value={nota1} onChangeText={setNota1} />
              <TextInput style={styles.inputHalf} keyboardType="numeric" placeholder="Nota 2" value={nota2} onChangeText={setNota2} />
            </View>
            <View style={styles.formRow}>
              <TextInput style={styles.inputHalf} keyboardType="numeric" placeholder="Aulas totais" value={aulasTotais} onChangeText={setAulasTotais} />
              <TextInput style={styles.inputHalf} keyboardType="numeric" placeholder="Faltas" value={faltas} onChangeText={setFaltas} />
            </View>

            <View style={styles.previewBox}>
              <Text style={styles.previewText}>Média: <Text style={styles.previewStrong}>{mediaPreview === null ? '-' : mediaPreview.toFixed(1)}</Text></Text>
              <Text style={styles.previewText}>Frequência: <Text style={styles.previewStrong}>{frequenciaCalculada.toFixed(1)}%</Text></Text>
              <Text style={[styles.previewText, { color: situacaoColor(situacaoPreview) }]}>Situação: <Text style={styles.previewStrong}>{situacaoPreview}</Text></Text>
            </View>

            <View style={styles.actionRow}>
              <Button title="Salvar boletim" onPress={salvar} loading={saving} style={styles.saveButton} />
              <Button title="Limpar" variant="outline" onPress={limpar} style={styles.clearButton} />
            </View>
          </View>
        )}

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>{isAluno ? 'Minhas matérias' : 'Boletins cadastrados e pendentes'}</Text>
          <TextInput style={styles.search} placeholder="Pesquisar por aluno, matrícula, matéria, professor ou curso" value={busca} onChangeText={setBusca} />
          {boletimFiltrado.length === 0 ? <Text style={styles.empty}>Nenhum boletim encontrado. Confira se alunos e disciplinas estão cadastrados no mesmo curso/semestre.</Text> : boletimFiltrado.map((item) => (
            <TouchableOpacity key={`${item.aluno_matricula}-${item.disciplina_id}`} style={styles.card} onPress={() => canEdit && preencherDoItem(item)} disabled={!canEdit}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.disciplina_nome}</Text>
                  <Text style={styles.cardSub}>{item.aluno_nome || item.aluno_matricula} • {item.aluno_matricula}</Text>
                  <Text style={styles.cardSub}>{item.aluno_curso || item.disciplina_curso} • {item.aluno_semestre || item.disciplina_semestre}º semestre • {item.aluno_periodo || item.periodo}</Text>
                  <Text style={styles.cardSub}>Professor: {item.professor_nome || 'Não vinculado'}</Text>
                </View>
                <Text style={[styles.situacao, { color: situacaoColor(item.situacao) }]}>{item.situacao || 'Pendente'}</Text>
              </View>
              <View style={styles.gradeRow}>
                <View style={styles.gradeBox}><Text style={styles.gradeLabel}>Prova</Text><Text style={styles.gradeValue}>{item.tipo_prova || '-'}</Text></View>
                <View style={styles.gradeBox}><Text style={styles.gradeLabel}>N1</Text><Text style={styles.gradeValue}>{notaLabel(item.nota1)}</Text></View>
                <View style={styles.gradeBox}><Text style={styles.gradeLabel}>N2</Text><Text style={styles.gradeValue}>{notaLabel(item.nota2)}</Text></View>
                <View style={styles.gradeBox}><Text style={styles.gradeLabel}>Média</Text><Text style={styles.gradeValue}>{notaLabel(item.media)}</Text></View>
                <View style={styles.gradeBox}><Text style={styles.gradeLabel}>Freq.</Text><Text style={styles.gradeValue}>{pctLabel(item.frequencia)}</Text></View>
                <View style={styles.gradeBox}><Text style={styles.gradeLabel}>Faltas</Text><Text style={styles.gradeValue}>{item.faltas ?? 0}/{item.aulas_totais ?? '-'}</Text></View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  hero: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  heroTitle: { color: colors.white, fontSize: fontSize.lg, fontWeight: '800' },
  heroSub: { color: '#DBEAFE', marginTop: spacing.xs, fontSize: fontSize.sm },
  kpiRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  kpi: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: radius.md, padding: spacing.sm },
  kpiValue: { color: colors.white, fontSize: fontSize.lg, fontWeight: '800' },
  kpiLabel: { color: '#DBEAFE', fontSize: fontSize.xs },
  panel: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 1 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: '800', color: colors.primary, marginBottom: spacing.xs },
  helper: { color: colors.textSecondary, fontSize: fontSize.sm, marginBottom: spacing.md },
  stepBadge: { alignSelf: 'flex-start', backgroundColor: '#DBEAFE', borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginBottom: spacing.xs },
  stepText: { color: colors.primary, fontWeight: '800', fontSize: fontSize.xs },
  pickerBox: { marginBottom: spacing.md },
  pickerLabel: { color: colors.textPrimary, fontWeight: '700', fontSize: fontSize.sm, marginBottom: spacing.xs },
  picker: { backgroundColor: colors.primaryLight, borderRadius: radius.md, height: 50 },
  warnText: { color: colors.danger, fontSize: fontSize.xs, marginTop: spacing.xs },
  selectedCard: { borderWidth: 1, borderColor: '#BFDBFE', backgroundColor: '#EFF6FF', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  selectedTitle: { fontWeight: '800', color: colors.primary },
  selectedSub: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },
  tipoRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  tipoButton: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center' },
  tipoButtonActive: { backgroundColor: colors.primary },
  tipoButtonText: { color: colors.primary, fontWeight: '700' },
  tipoButtonTextActive: { color: colors.white },
  formRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  inputHalf: { flex: 1, backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: spacing.md, fontSize: fontSize.md },
  previewBox: { backgroundColor: '#F8FAFC', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: '#E2E8F0' },
  previewText: { color: colors.textPrimary, fontSize: fontSize.sm, marginBottom: 2 },
  previewStrong: { fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  saveButton: { flex: 2 },
  clearButton: { flex: 1 },
  search: { backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: spacing.md, marginVertical: spacing.md, fontSize: fontSize.sm },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.md },
  card: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, backgroundColor: '#FAFAFA' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  cardTitle: { color: colors.textPrimary, fontSize: fontSize.md, fontWeight: '800' },
  cardSub: { color: colors.textSecondary, fontSize: fontSize.xs, marginTop: 2 },
  situacao: { fontWeight: '800', fontSize: fontSize.xs, textAlign: 'right' },
  gradeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginTop: spacing.md },
  gradeBox: { minWidth: 72, backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.sm, borderWidth: 1, borderColor: '#E5E7EB' },
  gradeLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
  gradeValue: { fontSize: fontSize.sm, fontWeight: '800', color: colors.textPrimary, marginTop: 2 },
});
