import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Hero {
  id: number;
  name: string;
  rank: string;
  image: string;
  period: string;
  conflict: string;
  region: string;
  awards: string[];
  birthYear: number;
  biography: string;
  timeline: Array<{ year: number; event: string }>;
}

const API_URL = 'https://functions.poehali.dev/28b83b8d-eec5-415d-ae63-844c40b0b4c4';

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [heroesData, setHeroesData] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setHeroesData(data);
    } catch (error) {
      console.error('Error fetching heroes:', error);
    } finally {
      setLoading(false);
    }
  };

  const regions = ['all', ...Array.from(new Set(heroesData.map(h => h.region))).sort()];

  const filteredHeroes = heroesData.filter(hero => {
    const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hero.rank.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPeriod = selectedPeriod === 'all' || hero.conflict.includes(selectedPeriod);
    const matchesRegion = selectedRegion === 'all' || hero.region === selectedRegion;
    return matchesSearch && matchesPeriod && matchesRegion;
  });

  if (selectedHero) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-primary text-primary-foreground py-6 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setSelectedHero(null)}
              className="text-primary-foreground hover:bg-primary-foreground/10 mb-4"
            >
              <Icon name="ArrowLeft" className="mr-2" size={20} />
              Назад к списку
            </Button>
            <h1 className="text-4xl font-bold font-heading">{selectedHero.name}</h1>
            <p className="text-lg mt-2 opacity-90">{selectedHero.rank}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-1">
              <img
                src={selectedHero.image}
                alt={selectedHero.name}
                className="w-full rounded-lg shadow-xl border-4 border-secondary"
              />
              <div className="mt-6 space-y-4">
                <div className="bg-card p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Calendar" className="text-primary" size={20} />
                    <h3 className="font-heading font-semibold">Годы жизни</h3>
                  </div>
                  <p className="text-muted-foreground">{selectedHero.period}</p>
                </div>
                <div className="bg-card p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Swords" className="text-primary" size={20} />
                    <h3 className="font-heading font-semibold">Конфликт</h3>
                  </div>
                  <p className="text-muted-foreground">{selectedHero.conflict}</p>
                </div>
                <div className="bg-card p-4 rounded-lg shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="MapPin" className="text-primary" size={20} />
                    <h3 className="font-heading font-semibold">Регион</h3>
                  </div>
                  <p className="text-muted-foreground">{selectedHero.region}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                  <Icon name="BookOpen" className="text-primary" size={24} />
                  Биография
                </h2>
                <p className="text-lg leading-relaxed">{selectedHero.biography}</p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
                  <Icon name="Award" className="text-secondary" size={24} />
                  Награды и звания
                </h2>
                <div className="flex flex-wrap gap-3">
                  {selectedHero.awards.map((award, idx) => (
                    <Badge
                      key={idx}
                      className="text-base px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      {award}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-heading font-bold mb-6 flex items-center gap-2">
                  <Icon name="Clock" className="text-primary" size={24} />
                  Временная шкала событий
                </h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/30"></div>
                  <div className="space-y-6">
                    {selectedHero.timeline.map((event, idx) => (
                      <div key={idx} className="relative pl-12 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="absolute left-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-lg">
                          {idx + 1}
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="text-primary font-bold text-lg mb-1">{event.year}</div>
                          <div className="text-foreground">{event.event}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground py-16 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-4">
            <Button
              variant="secondary"
              onClick={() => window.location.href = '/login'}
              className="flex items-center gap-2"
            >
              <Icon name="Shield" size={18} />
              Вход для администратора
            </Button>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center shadow-2xl">
                <Icon name="Medal" size={40} className="text-secondary-foreground" />
              </div>
            </div>
            <h1 className="text-5xl font-bold font-heading mb-4 animate-fade-in">
              Наши Герои
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
              Память о подвиге. История отваги. Примеры мужества для будущих поколений.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-card p-6 rounded-lg shadow-lg mb-8 animate-scale-in">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Поиск по имени или званию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg py-6"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Icon name="Filter" size={16} />
                Фильтр по периоду
              </h3>
              <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-auto gap-2">
                  <TabsTrigger value="all" className="text-base py-3">
                    Все периоды
                  </TabsTrigger>
                  <TabsTrigger value="Великая Отечественная война" className="text-base py-3">
                    ВОВ 1941-1945
                  </TabsTrigger>
                  <TabsTrigger value="СВО" className="text-base py-3">
                    СВО
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Icon name="MapPin" size={16} />
                Фильтр по региону
              </h3>
              <Tabs value={selectedRegion} onValueChange={setSelectedRegion} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-2">
                  <TabsTrigger value="all" className="text-base py-3">
                    Все регионы
                  </TabsTrigger>
                  {regions.filter(r => r !== 'all').map(region => (
                    <TabsTrigger key={region} value={region} className="text-base py-3">
                      {region}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-heading font-semibold text-foreground">
            Найдено героев: <span className="text-primary">{filteredHeroes.length}</span>
          </h2>
        </div>

        {loading && (
          <div className="text-center py-16">
            <Icon name="Loader2" className="mx-auto animate-spin text-primary mb-4" size={64} />
            <p className="text-muted-foreground">Загрузка героев...</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && filteredHeroes.map((hero, idx) => (
            <Card
              key={hero.id}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group animate-fade-in border-2 hover:border-primary"
              style={{ animationDelay: `${idx * 50}ms` }}
              onClick={() => setSelectedHero(hero)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={hero.image}
                  alt={hero.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">
                  {hero.conflict}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                  {hero.name}
                </h3>
                <p className="text-muted-foreground mb-3">{hero.rank}</p>
                <p className="text-sm text-muted-foreground mb-4">{hero.period}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hero.awards.slice(0, 2).map((award, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {award}
                    </Badge>
                  ))}
                  {hero.awards.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{hero.awards.length - 2}
                    </Badge>
                  )}
                </div>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                  Подробнее
                  <Icon name="ArrowRight" className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && filteredHeroes.length === 0 && (
          <div className="text-center py-16">
            <Icon name="Search" className="mx-auto text-muted-foreground mb-4" size={64} />
            <h3 className="text-2xl font-heading font-semibold text-muted-foreground mb-2">
              Герои не найдены
            </h3>
            <p className="text-muted-foreground">
              Попробуйте изменить критерии поиска или фильтрации
            </p>
          </div>
        )}
      </div>
    </div>
  );
}