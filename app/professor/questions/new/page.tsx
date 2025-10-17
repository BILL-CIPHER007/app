
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DISCIPLINAS, DIFICULDADES } from '@/lib/constants';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function NewQuestionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    disciplina: '',
    assunto: '',
    enunciado: '',
    alternativas: ['', '', '', '', ''],
    respostaCorreta: 0,
    dificuldade: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/professor/questions');
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao criar questão');
      }
    } catch (error) {
      console.error('Erro ao criar questão:', error);
      alert('Erro ao criar questão');
    } finally {
      setLoading(false);
    }
  };

  const updateAlternativa = (index: number, value: string) => {
    const newAlternativas = [...formData.alternativas];
    newAlternativas[index] = value;
    setFormData({ ...formData, alternativas: newAlternativas });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/professor/questions">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nova Questão</h1>
          <p className="text-gray-600 mt-1">
            Crie uma nova questão para seus quizzes
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Defina a disciplina, assunto e dificuldade da questão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Disciplina *</label>
                    <Select
                      value={formData.disciplina}
                      onValueChange={(value) => setFormData({ ...formData, disciplina: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DISCIPLINAS).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dificuldade *</label>
                    <Select
                      value={formData.dificuldade}
                      onValueChange={(value) => setFormData({ ...formData, dificuldade: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a dificuldade" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DIFICULDADES).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Assunto *</label>
                  <Input
                    placeholder="Ex: Interpretação de texto, Equações do 2º grau..."
                    value={formData.assunto}
                    onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enunciado</CardTitle>
                <CardDescription>
                  Digite o enunciado completo da questão
                </CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full min-h-[120px] p-3 border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Digite o enunciado da questão..."
                  value={formData.enunciado}
                  onChange={(e) => setFormData({ ...formData, enunciado: e.target.value })}
                  required
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alternativas</CardTitle>
                <CardDescription>
                  Digite as 5 alternativas e marque a resposta correta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.alternativas.map((alternativa, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="respostaCorreta"
                      checked={formData.respostaCorreta === index}
                      onChange={() => setFormData({ ...formData, respostaCorreta: index })}
                      className="w-4 h-4 text-primary"
                    />
                    <div className="flex-1">
                      <Input
                        placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                        value={alternativa}
                        onChange={(e) => updateAlternativa(index, e.target.value)}
                        required
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-500 w-8">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Visualize como a questão aparecerá
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.disciplina && (
                  <div className="text-sm text-primary font-medium">
                    {DISCIPLINAS[formData.disciplina as keyof typeof DISCIPLINAS]}
                  </div>
                )}
                
                {formData.assunto && (
                  <h3 className="font-semibold">{formData.assunto}</h3>
                )}
                
                {formData.enunciado && (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {formData.enunciado}
                  </p>
                )}
                
                {formData.alternativas.some(alt => alt.trim()) && (
                  <div className="space-y-2">
                    {formData.alternativas.map((alternativa, index) => (
                      alternativa.trim() && (
                        <div
                          key={index}
                          className={`text-sm p-2 rounded border ${
                            formData.respostaCorreta === index
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <span className="font-medium mr-2">
                            {String.fromCharCode(65 + index)})
                          </span>
                          {alternativa}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Questão'}
                </Button>
                <Link href="/professor/questions" className="block">
                  <Button variant="outline" className="w-full">
                    Cancelar
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
