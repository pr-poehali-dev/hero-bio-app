import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Hero {
  id: number;
  name: string;
  rank: string;
  image: string;
  period: string;
  conflict: string;
  awards: string[];
  birthYear: number;
  biography: string;
  timeline: Array<{ year: number; event: string }>;
}

const initialHeroes: Hero[] = [
  {
    id: 1,
    name: "Алексей Петрович Маресьев",
    rank: "Лётчик-истребитель",
    image: "https://cdn.poehali.dev/projects/43d2d783-eb2e-4d1b-8798-159071297277/files/83d53e6e-d034-40a5-a063-701c36d74b9b.jpg",
    period: "1916-2001",
    conflict: "Великая Отечественная война",
    awards: ["Герой Советского Союза", "Орден Ленина", "Орден Красного Знамени"],
    birthYear: 1916,
    biography: "Советский военный лётчик-истребитель, Герой Советского Союза. Прототип героя повести Бориса Полевого «Повесть о настоящем человеке». Несмотря на тяжелое ранение и ампутацию обеих ног, вернулся в строй и продолжил сражаться с врагом.",
    timeline: [
      { year: 1941, event: "Призван в РККА" },
      { year: 1942, event: "Тяжелое ранение, ампутация ног" },
      { year: 1943, event: "Возвращение в строй" },
      { year: 1945, event: "Победа в войне, 86 боевых вылетов" }
    ]
  },
  {
    id: 2,
    name: "Зоя Анатольевна Космодемьянская",
    rank: "Партизанка-диверсант",
    image: "https://cdn.poehali.dev/projects/43d2d783-eb2e-4d1b-8798-159071297277/files/c43cd418-bcaf-4c13-b400-adc568f236ed.jpg",
    period: "1923-1941",
    conflict: "Великая Отечественная война",
    awards: ["Герой Советского Союза (посмертно)", "Орден Ленина"],
    birthYear: 1923,
    biography: "Красноармеец диверсионно-разведывательной группы штаба Западного фронта. Первая женщина, удостоенная звания Герой Советского Союза во время Великой Отечественной войны (посмертно). Казнена немецкими захватчиками в деревне Петрищево.",
    timeline: [
      { year: 1941, event: "Вступила в партизанский отряд" },
      { year: 1941, event: "Диверсионные операции в тылу врага" },
      { year: 1941, event: "Поимка и казнь в Петрищево" },
      { year: 1942, event: "Присвоение звания Героя (посмертно)" }
    ]
  },
  {
    id: 3,
    name: "Александр Иванович Покрышкин",
    rank: "Маршал авиации",
    image: "https://cdn.poehali.dev/projects/43d2d783-eb2e-4d1b-8798-159071297277/files/cda830e3-8d6c-4c05-95bc-094bab8b8ab4.jpg",
    period: "1913-1985",
    conflict: "Великая Отечественная война",
    awards: ["Герой Советского Союза (трижды)", "Орден Ленина (6)", "Орден Красного Знамени (4)"],
    birthYear: 1913,
    biography: "Советский военачальник, лётчик-ас, второй по результативности (после Ивана Кожедуба) пилот-истребитель среди лётчиков стран антигитлеровской коалиции во Второй мировой войне. Сбил 59 самолётов противника лично и 6 — в группе.",
    timeline: [
      { year: 1939, event: "Начало службы в ВВС" },
      { year: 1943, event: "Первое присвоение звания Героя" },
      { year: 1943, event: "Второе присвоение звания Героя" },
      { year: 1944, event: "Третье присвоение звания Героя" }
    ]
  }
];

export default function Admin() {
  const [heroes, setHeroes] = useState<Hero[]>(initialHeroes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    rank: '',
    image: '',
    period: '',
    conflict: '',
    awards: '',
    birthYear: '',
    biography: '',
    timeline: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      rank: '',
      image: '',
      period: '',
      conflict: '',
      awards: '',
      birthYear: '',
      biography: '',
      timeline: ''
    });
    setEditingHero(null);
  };

  const handleEdit = (hero: Hero) => {
    setEditingHero(hero);
    setFormData({
      name: hero.name,
      rank: hero.rank,
      image: hero.image,
      period: hero.period,
      conflict: hero.conflict,
      awards: hero.awards.join(', '),
      birthYear: hero.birthYear.toString(),
      biography: hero.biography,
      timeline: hero.timeline.map(t => `${t.year}: ${t.event}`).join('\n')
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setHeroes(heroes.filter(h => h.id !== id));
    toast({
      title: "Герой удален",
      description: "Запись успешно удалена из каталога",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const timelineArray = formData.timeline
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [yearStr, ...eventParts] = line.split(':');
        return {
          year: parseInt(yearStr.trim()),
          event: eventParts.join(':').trim()
        };
      });

    const heroData: Hero = {
      id: editingHero ? editingHero.id : Date.now(),
      name: formData.name,
      rank: formData.rank,
      image: formData.image,
      period: formData.period,
      conflict: formData.conflict,
      awards: formData.awards.split(',').map(a => a.trim()).filter(a => a),
      birthYear: parseInt(formData.birthYear),
      biography: formData.biography,
      timeline: timelineArray
    };

    if (editingHero) {
      setHeroes(heroes.map(h => h.id === editingHero.id ? heroData : h));
      toast({
        title: "Герой обновлен",
        description: "Информация успешно сохранена",
      });
    } else {
      setHeroes([...heroes, heroData]);
      toast({
        title: "Герой добавлен",
        description: "Новый герой добавлен в каталог",
      });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground py-8 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold font-heading mb-2">Админ-панель</h1>
              <p className="text-lg opacity-90">Управление героями России</p>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2"
            >
              <Icon name="Eye" size={20} />
              Перейти на сайт
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-heading font-bold">Всего героев: {heroes.length}</h2>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button size="lg" className="flex items-center gap-2">
                <Icon name="Plus" size={20} />
                Добавить героя
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">
                  {editingHero ? 'Редактировать героя' : 'Добавить нового героя'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Полное имя *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Иванов Иван Иванович"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rank">Звание/должность *</Label>
                    <Input
                      id="rank"
                      value={formData.rank}
                      onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                      required
                      placeholder="Лётчик-истребитель"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">URL изображения *</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                    placeholder="https://..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="period">Период жизни *</Label>
                    <Input
                      id="period"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      required
                      placeholder="1916-2001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="birthYear">Год рождения *</Label>
                    <Input
                      id="birthYear"
                      type="number"
                      value={formData.birthYear}
                      onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                      required
                      placeholder="1916"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="conflict">Конфликт *</Label>
                  <Input
                    id="conflict"
                    value={formData.conflict}
                    onChange={(e) => setFormData({ ...formData, conflict: e.target.value })}
                    required
                    placeholder="Великая Отечественная война"
                  />
                </div>

                <div>
                  <Label htmlFor="awards">Награды (через запятую) *</Label>
                  <Textarea
                    id="awards"
                    value={formData.awards}
                    onChange={(e) => setFormData({ ...formData, awards: e.target.value })}
                    required
                    placeholder="Герой Советского Союза, Орден Ленина, Орден Красного Знамени"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="biography">Биография *</Label>
                  <Textarea
                    id="biography"
                    value={formData.biography}
                    onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                    required
                    placeholder="Краткая биография героя..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="timeline">Временная шкала (каждое событие с новой строки) *</Label>
                  <Textarea
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    required
                    placeholder="1941: Призван в РККА&#10;1942: Тяжелое ранение&#10;1943: Возвращение в строй"
                    rows={5}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Формат: год: событие (каждое событие с новой строки)
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Отмена
                  </Button>
                  <Button type="submit">
                    {editingHero ? 'Сохранить изменения' : 'Добавить героя'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {heroes.map((hero) => (
            <Card key={hero.id} className="animate-fade-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <img
                      src={hero.image}
                      alt={hero.name}
                      className="w-24 h-24 object-cover rounded-lg border-2 border-primary"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-xl font-heading mb-2">{hero.name}</CardTitle>
                      <p className="text-muted-foreground mb-2">{hero.rank}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{hero.period}</Badge>
                        <Badge className="bg-primary text-primary-foreground">{hero.conflict}</Badge>
                        <Badge variant="secondary">{hero.awards.length} наград</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(hero)}
                    >
                      <Icon name="Pencil" size={18} />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(hero.id)}
                    >
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{hero.biography}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
