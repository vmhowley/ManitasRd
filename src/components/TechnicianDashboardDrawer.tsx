import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar, Clock, DollarSign, Star, Users, CheckCircle, XCircle, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Drawer } from './ui/Drawer';
import { Button } from './ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';

// Types
interface ServiceStats {
  completed: number;
  cancelled: number;
  pending: number;
  total: number;
}

interface EarningStats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  lastMonth: number;
  total: number;
}

interface RatingStats {
  average: number;
  total: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ClientStats {
  total: number;
  new: number;
  returning: number;
}

interface UpcomingService {
  id: string;
  clientName: string;
  clientAvatar?: string;
  serviceName: string;
  date: Date;
  time: string;
  address: string;
  price: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface RecentReview {
  id: string;
  clientName: string;
  clientAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  serviceName: string;
}

interface TechnicianDashboardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  serviceStats: ServiceStats;
  earningStats: EarningStats;
  ratingStats: RatingStats;
  clientStats: ClientStats;
  upcomingServices: UpcomingService[];
  recentReviews: RecentReview[];
  onViewAllServices: () => void;
  onViewAllReviews: () => void;
  onServiceSelect: (serviceId: string) => void;
}

const TechnicianDashboardDrawer: React.FC<TechnicianDashboardDrawerProps> = ({
  isOpen,
  onClose,
  serviceStats,
  earningStats,
  ratingStats,
  clientStats,
  upcomingServices,
  recentReviews,
  onViewAllServices,
  onViewAllReviews,
  onServiceSelect,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Format currency
  const formatCurrency = (amount: number) => {
    return `RD$ ${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-DO', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Format month and year
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('es-DO', {
      month: 'long',
      year: 'numeric',
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentMonth(newDate);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  // Calculate rating percentage
  const calculateRatingPercentage = (rating: number) => {
    if (ratingStats.total === 0) return 0;
    return (ratingStats.distribution[rating as 1 | 2 | 3 | 4 | 5] / ratingStats.total) * 100;
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="right"
      size="lg"
      title="Panel de Control"
    >
      <div className="h-full flex flex-col">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3 p-1 mx-4 mt-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Ganancias</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Agenda</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Servicios</h3>
                      <p className="text-2xl font-bold">{serviceStats.total}</p>
                    </div>
                    <div className="bg-primary-100 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-primary-500" />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="font-medium text-success-500">{serviceStats.completed}</p>
                      <p className="text-neutral-500">Completados</p>
                    </div>
                    <div>
                      <p className="font-medium text-warning-500">{serviceStats.pending}</p>
                      <p className="text-neutral-500">Pendientes</p>
                    </div>
                    <div>
                      <p className="font-medium text-danger-500">{serviceStats.cancelled}</p>
                      <p className="text-neutral-500">Cancelados</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Clientes</h3>
                      <p className="text-2xl font-bold">{clientStats.total}</p>
                    </div>
                    <div className="bg-secondary-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-secondary-500" />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                    <div>
                      <p className="font-medium text-primary-500">{clientStats.new}</p>
                      <p className="text-neutral-500">Nuevos</p>
                    </div>
                    <div>
                      <p className="font-medium text-secondary-500">{clientStats.returning}</p>
                      <p className="text-neutral-500">Recurrentes</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Ganancias</h3>
                      <p className="text-2xl font-bold">{formatCurrency(earningStats.thisMonth)}</p>
                    </div>
                    <div className="bg-success-100 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-success-500" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-500">Mes anterior</span>
                      <span className="font-medium">{formatCurrency(earningStats.lastMonth)}</span>
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      {earningStats.thisMonth > earningStats.lastMonth ? (
                        <>
                          <TrendingUp className="h-3 w-3 text-success-500 mr-1" />
                          <span className="text-success-500">
                            +{Math.round(((earningStats.thisMonth - earningStats.lastMonth) / earningStats.lastMonth) * 100)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-3 w-3 text-danger-500 mr-1 transform rotate-180" />
                          <span className="text-danger-500">
                            {Math.round(((earningStats.lastMonth - earningStats.thisMonth) / earningStats.lastMonth) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500">Calificación</h3>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold">{ratingStats.average.toFixed(1)}</p>
                        <Star className="h-4 w-4 text-warning-500 ml-1" />
                      </div>
                    </div>
                    <div className="bg-warning-100 p-2 rounded-full">
                      <Star className="h-5 w-5 text-warning-500" />
                    </div>
                  </div>
                  <div className="mt-2 space-y-1">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center text-xs">
                        <span className="w-3">{rating}</span>
                        <Star className="h-3 w-3 text-warning-500 mx-1" />
                        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-warning-500 rounded-full" 
                            style={{ width: `${calculateRatingPercentage(rating)}%` }}
                          />
                        </div>
                        <span className="ml-2 text-neutral-500">
                          {ratingStats.distribution[rating as 1 | 2 | 3 | 4 | 5]}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Upcoming Services */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Próximos Servicios</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onViewAllServices}
                  >
                    Ver todos
                  </Button>
                </div>

                {upcomingServices.length === 0 ? (
                  <Card className="p-4 text-center text-neutral-500">
                    <Calendar className="h-10 w-10 mx-auto mb-2 text-neutral-300" />
                    <p>No tienes servicios programados</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {upcomingServices.slice(0, 3).map(service => (
                      <Card 
                        key={service.id} 
                        className="p-3 hover:bg-neutral-50 cursor-pointer transition-colors"
                        onClick={() => onServiceSelect(service.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{service.serviceName}</h3>
                            <p className="text-sm text-neutral-600">{service.clientName}</p>
                          </div>
                          <Badge 
                            variant={
                              service.status === 'scheduled' ? 'warning' : 
                              service.status === 'in-progress' ? 'primary' : 
                              service.status === 'completed' ? 'success' : 'danger'
                            }
                            size="sm"
                          >
                            {service.status === 'scheduled' ? 'Programado' : 
                             service.status === 'in-progress' ? 'En progreso' : 
                             service.status === 'completed' ? 'Completado' : 'Cancelado'}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-neutral-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="mr-3">{formatDate(service.date)}</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{service.time}</span>
                        </div>
                        <div className="mt-1 flex justify-between items-center">
                          <p className="text-sm text-neutral-500 truncate max-w-[70%]">{service.address}</p>
                          <p className="font-medium">{formatCurrency(service.price)}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Reviews */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Reseñas Recientes</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onViewAllReviews}
                  >
                    Ver todas
                  </Button>
                </div>

                {recentReviews.length === 0 ? (
                  <Card className="p-4 text-center text-neutral-500">
                    <Star className="h-10 w-10 mx-auto mb-2 text-neutral-300" />
                    <p>No tienes reseñas recientes</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {recentReviews.slice(0, 3).map(review => (
                      <Card key={review.id} className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{review.clientName}</h3>
                            <p className="text-sm text-neutral-600">{review.serviceName}</p>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < review.rating ? 'text-warning-500' : 'text-neutral-200'}`} 
                                fill={i < review.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm">"{review.comment}"</p>
                        <p className="mt-1 text-xs text-neutral-500">{formatDate(review.date)}</p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-neutral-500">Hoy</h3>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(earningStats.today)}</p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-neutral-500">Esta Semana</h3>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(earningStats.thisWeek)}</p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-neutral-500">Este Mes</h3>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(earningStats.thisMonth)}</p>
                </Card>
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-neutral-500">Total</h3>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(earningStats.total)}</p>
                </Card>
              </div>

              {/* Monthly Chart Placeholder */}
              <Card className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Ganancias Mensuales</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      onClick={goToPreviousMonth}
                      aria-label="Mes anterior"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-sm font-medium">{formatMonthYear(currentMonth)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1"
                      onClick={goToNextMonth}
                      aria-label="Mes siguiente"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
                  <div className="text-center text-neutral-500">
                    <BarChart3 className="h-10 w-10 mx-auto mb-2 text-neutral-300" />
                    <p>Gráfico de ganancias mensuales</p>
                    <p className="text-xs">Los datos se mostrarán aquí</p>
                  </div>
                </div>
              </Card>

              {/* Service Category Distribution */}
              <Card className="p-4">
                <h3 className="font-medium mb-4">Distribución por Categoría</h3>
                <div className="flex">
                  <div className="w-1/3 flex items-center justify-center">
                    <div className="h-32 w-32 flex items-center justify-center bg-neutral-50 rounded-full border border-dashed border-neutral-200">
                      <PieChart className="h-10 w-10 text-neutral-300" />
                    </div>
                  </div>
                  <div className="w-2/3 space-y-3">
                    {/* Example categories */}
                    {[
                      { name: 'Plomería', percentage: 35, color: 'bg-primary-500' },
                      { name: 'Electricidad', percentage: 25, color: 'bg-secondary-500' },
                      { name: 'Carpintería', percentage: 20, color: 'bg-success-500' },
                      { name: 'Pintura', percentage: 15, color: 'bg-warning-500' },
                      { name: 'Otros', percentage: 5, color: 'bg-neutral-500' },
                    ].map((category, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${category.color} mr-2`} />
                        <div className="flex-1">
                          <div className="flex justify-between text-sm">
                            <span>{category.name}</span>
                            <span className="font-medium">{category.percentage}%</span>
                          </div>
                          <div className="h-1.5 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                            <div 
                              className={`h-full ${category.color}`} 
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Payment Methods */}
              <Card className="p-4">
                <h3 className="font-medium mb-4">Métodos de Pago</h3>
                <div className="space-y-3">
                  {/* Example payment methods */}
                  {[
                    { name: 'Efectivo', percentage: 45, amount: 45000 },
                    { name: 'Tarjeta de crédito', percentage: 35, amount: 35000 },
                    { name: 'Transferencia bancaria', percentage: 15, amount: 15000 },
                    { name: 'Otros', percentage: 5, amount: 5000 },
                  ].map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span>{method.name}</span>
                          <span className="font-medium">{method.percentage}%</span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-primary-500" 
                            style={{ width: `${method.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="ml-4 text-sm font-medium">{formatCurrency(method.amount)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Calendar Navigation */}
              <Card className="p-4">
                <div className="flex justify-between items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPreviousMonth}
                    aria-label="Mes anterior"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    <span>Anterior</span>
                  </Button>
                  <h3 className="font-medium">{formatMonthYear(currentMonth)}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNextMonth}
                    aria-label="Mes siguiente"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </Button>
                </div>

                {/* Calendar Placeholder */}
                <div className="mt-4 h-64 flex items-center justify-center bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
                  <div className="text-center text-neutral-500">
                    <Calendar className="h-10 w-10 mx-auto mb-2 text-neutral-300" />
                    <p>Calendario mensual</p>
                    <p className="text-xs">Los eventos se mostrarán aquí</p>
                  </div>
                </div>
              </Card>

              {/* Today's Schedule */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Agenda de Hoy</h2>

                {upcomingServices.filter(service => {
                  const today = new Date();
                  return service.date.toDateString() === today.toDateString();
                }).length === 0 ? (
                  <Card className="p-4 text-center text-neutral-500">
                    <CheckCircle className="h-10 w-10 mx-auto mb-2 text-neutral-300" />
                    <p>No tienes servicios programados para hoy</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {upcomingServices
                      .filter(service => {
                        const today = new Date();
                        return service.date.toDateString() === today.toDateString();
                      })
                      .sort((a, b) => {
                        return a.time.localeCompare(b.time);
                      })
                      .map(service => (
                        <Card 
                          key={service.id} 
                          className="p-3 hover:bg-neutral-50 cursor-pointer transition-colors"
                          onClick={() => onServiceSelect(service.id)}
                        >
                          <div className="flex">
                            <div className="w-16 text-center border-r border-neutral-200 pr-2">
                              <p className="font-medium">{service.time}</p>
                            </div>
                            <div className="flex-1 pl-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{service.serviceName}</h3>
                                  <p className="text-sm text-neutral-600">{service.clientName}</p>
                                </div>
                                <Badge 
                                  variant={
                                    service.status === 'scheduled' ? 'warning' : 
                                    service.status === 'in-progress' ? 'primary' : 
                                    service.status === 'completed' ? 'success' : 'danger'
                                  }
                                  size="sm"
                                >
                                  {service.status === 'scheduled' ? 'Programado' : 
                                   service.status === 'in-progress' ? 'En progreso' : 
                                   service.status === 'completed' ? 'Completado' : 'Cancelado'}
                                </Badge>
                              </div>
                              <p className="text-sm text-neutral-500 mt-1 truncate">{service.address}</p>
                              <p className="font-medium mt-1">{formatCurrency(service.price)}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </div>

              {/* Upcoming Schedule */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Próximos Servicios</h2>

                {upcomingServices.filter(service => {
                  const today = new Date();
                  return service.date > today && service.date.toDateString() !== today.toDateString();
                }).length === 0 ? (
                  <Card className="p-4 text-center text-neutral-500">
                    <Calendar className="h-10 w-10 mx-auto mb-2 text-neutral-300" />
                    <p>No tienes servicios programados próximamente</p>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {upcomingServices
                      .filter(service => {
                        const today = new Date();
                        return service.date > today && service.date.toDateString() !== today.toDateString();
                      })
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .slice(0, 5)
                      .map(service => (
                        <Card 
                          key={service.id} 
                          className="p-3 hover:bg-neutral-50 cursor-pointer transition-colors"
                          onClick={() => onServiceSelect(service.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{service.serviceName}</h3>
                              <p className="text-sm text-neutral-600">{service.clientName}</p>
                            </div>
                            <Badge 
                              variant={
                                service.status === 'scheduled' ? 'warning' : 
                                service.status === 'in-progress' ? 'primary' : 
                                service.status === 'completed' ? 'success' : 'danger'
                              }
                              size="sm"
                            >
                              {service.status === 'scheduled' ? 'Programado' : 
                               service.status === 'in-progress' ? 'En progreso' : 
                               service.status === 'completed' ? 'Completado' : 'Cancelado'}
                            </Badge>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-neutral-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span className="mr-3">{formatDate(service.date)}</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{service.time}</span>
                          </div>
                          <div className="mt-1 flex justify-between items-center">
                            <p className="text-sm text-neutral-500 truncate max-w-[70%]">{service.address}</p>
                            <p className="font-medium">{formatCurrency(service.price)}</p>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Drawer>
  );
};

// Dashboard button component
interface DashboardButtonProps {
  onClick: () => void;
  variant?: 'ghost' | 'outline' | 'subtle' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const DashboardButton: React.FC<DashboardButtonProps> = ({
  onClick,
  variant = 'ghost',
  size = 'md',
  className = '',
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`flex items-center space-x-2 ${className}`}
      aria-label="Panel de control"
    >
      <BarChart3 className={size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6'} />
      <span className="hidden md:inline">Panel</span>
    </Button>
  );
};

// Example usage component
export const TechnicianDashboardExample: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Example data
  const serviceStats: ServiceStats = {
    completed: 127,
    cancelled: 8,
    pending: 15,
    total: 150,
  };

  const earningStats: EarningStats = {
    today: 3500,
    thisWeek: 18500,
    thisMonth: 75000,
    lastMonth: 68000,
    total: 850000,
  };

  const ratingStats: RatingStats = {
    average: 4.8,
    total: 95,
    distribution: {
      5: 75,
      4: 15,
      3: 3,
      2: 1,
      1: 1,
    },
  };

  const clientStats: ClientStats = {
    total: 85,
    new: 12,
    returning: 73,
  };

  const upcomingServices: UpcomingService[] = [
    {
      id: '1',
      clientName: 'María Rodríguez',
      clientAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      serviceName: 'Reparación de Plomería',
      date: new Date(),
      time: '10:00 AM',
      address: 'Calle Principal #123, Santo Domingo',
      price: 1500,
      status: 'scheduled',
    },
    {
      id: '2',
      clientName: 'Juan Pérez',
      clientAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      serviceName: 'Instalación Eléctrica',
      date: new Date(),
      time: '2:30 PM',
      address: 'Av. Independencia #456, Santo Domingo',
      price: 2200,
      status: 'in-progress',
    },
    {
      id: '3',
      clientName: 'Ana Gómez',
      clientAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      serviceName: 'Reparación de Aire Acondicionado',
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: '11:00 AM',
      address: 'Calle Las Flores #789, Santiago',
      price: 3000,
      status: 'scheduled',
    },
    {
      id: '4',
      clientName: 'Carlos Méndez',
      clientAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      serviceName: 'Pintura de Interiores',
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      time: '9:00 AM',
      address: 'Av. Las Américas #101, Santo Domingo',
      price: 5000,
      status: 'scheduled',
    },
    {
      id: '5',
      clientName: 'Laura Sánchez',
      clientAvatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      serviceName: 'Reparación de Lavadora',
      date: new Date(Date.now() + 259200000), // 3 days from now
      time: '3:00 PM',
      address: 'Calle El Sol #202, Santiago',
      price: 1800,
      status: 'scheduled',
    },
  ];

  const recentReviews: RecentReview[] = [
    {
      id: '1',
      clientName: 'Pedro Martínez',
      clientAvatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      rating: 5,
      comment: 'Excelente servicio, muy profesional y puntual. Resolvió el problema rápidamente.',
      date: new Date(Date.now() - 86400000), // Yesterday
      serviceName: 'Reparación de Plomería',
    },
    {
      id: '2',
      clientName: 'Sofía Ramírez',
      clientAvatar: 'https://randomuser.me/api/portraits/women/7.jpg',
      rating: 4,
      comment: 'Buen trabajo, aunque tardó un poco más de lo esperado. El resultado final fue muy bueno.',
      date: new Date(Date.now() - 172800000), // 2 days ago
      serviceName: 'Instalación Eléctrica',
    },
    {
      id: '3',
      clientName: 'Luis Torres',
      clientAvatar: 'https://randomuser.me/api/portraits/men/8.jpg',
      rating: 5,
      comment: 'Muy satisfecho con el servicio. Recomendado 100%.',
      date: new Date(Date.now() - 259200000), // 3 days ago
      serviceName: 'Reparación de Aire Acondicionado',
    },
  ];

  // Handle view all services
  const handleViewAllServices = () => {
    // Navigate to services page
    console.log('View all services');
  };

  // Handle view all reviews
  const handleViewAllReviews = () => {
    // Navigate to reviews page
    console.log('View all reviews');
  };

  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    // Navigate to service details
    console.log('Selected service:', serviceId);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Control del Técnico</h1>
      
      <DashboardButton 
        onClick={() => setIsOpen(true)} 
        variant="primary"
      />
      
      <TechnicianDashboardDrawer 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        serviceStats={serviceStats}
        earningStats={earningStats}
        ratingStats={ratingStats}
        clientStats={clientStats}
        upcomingServices={upcomingServices}
        recentReviews={recentReviews}
        onViewAllServices={handleViewAllServices}
        onViewAllReviews={handleViewAllReviews}
        onServiceSelect={handleServiceSelect}
      />
    </div>
  );
};

export default TechnicianDashboardDrawer;