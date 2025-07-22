import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quoteRequestService, type QuoteRequest, type ProposalData } from '../services/quoteRequestService';
import { API_BASE_URL } from '../api/config';
import { ArrowLeft, MapPin, Calendar, Wrench, CheckCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Formulario para que el técnico envíe su propuesta
const ProposalForm: React.FC<{ quoteRequestId: string; onProposalSubmitted: () => void }> = ({ quoteRequestId, onProposalSubmitted }) => {
    const [laborCost, setLaborCost] = useState('');
    const [materialsCost, setMaterialsCost] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [comments, setComments] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!laborCost || !estimatedTime) {
            setError('Los campos de costo de mano de obra y tiempo estimado son obligatorios.');
            return;
        }
        setLoading(true);
        setError(null);

        const proposalData: ProposalData = {
            laborCost: parseFloat(laborCost),
            materialsCost: materialsCost ? parseFloat(materialsCost) : 0,
            estimatedTime,
            comments,
        };

        try {
            await quoteRequestService.addProposal(quoteRequestId, proposalData);
            onProposalSubmitted();
        } catch (err) {
            console.error('Error submitting proposal:', err);
            setError('No se pudo enviar la propuesta. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mt-8 space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Enviar mi Propuesta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="laborCost" className="block text-sm font-medium text-gray-700">Costo Mano de Obra (RD$)</label>
                    <input type="number" id="laborCost" value={laborCost} onChange={e => setLaborCost(e.target.value)} className="w-full mt-1 p-2 border rounded-md" required />
                </div>
                <div>
                    <label htmlFor="materialsCost" className="block text-sm font-medium text-gray-700">Costo Materiales (RD$)</label>
                    <input type="number" id="materialsCost" value={materialsCost} onChange={e => setMaterialsCost(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
                </div>
            </div>
            <div>
                <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700">Tiempo Estimado</label>
                <input type="text" id="estimatedTime" value={estimatedTime} onChange={e => setEstimatedTime(e.target.value)} placeholder="Ej: 2-3 días" className="w-full mt-1 p-2 border rounded-md" required />
            </div>
            <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700">Comentarios Adicionales</label>
                <textarea id="comments" value={comments} onChange={e => setComments(e.target.value)} rows={3} className="w-full mt-1 p-2 border rounded-md"></textarea>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar Propuesta'}
            </button>
        </form>
    );
};

// Muestra las propuestas recibidas al cliente
const ProposalsList: React.FC<{ request: QuoteRequest; onAccept: (proposalId: string) => Promise<void> }> = ({ request, onAccept }) => {
    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Propuestas Recibidas</h3>
            {request.proposals.length === 0 ? (
                <p className="text-gray-500">Aún no has recibido ninguna propuesta.</p>
            ) : (
                <div className="space-y-4">
                    {request.proposals.map(p => {
                        const isAccepted = request.acceptedProposalId === p._id;
                        const canAccept = request.status === 'quoted' && !request.acceptedProposalId;
                        return (
                            <div key={p._id} className={`bg-white border rounded-lg p-4 ${isAccepted ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-200'}`}>
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold">{p.technicianId.name}</p>
                                    <p className="text-lg font-bold text-blue-600">RD${p.totalPrice.toFixed(2)}</p>
                                </div>
                                <p className="text-sm text-gray-500">Tiempo estimado: {p.estimatedTime}</p>
                                {p.comments && <p className="mt-2 text-gray-700">{p.comments}</p>}
                                {isAccepted ? (
                                    <p className="mt-4 text-green-600 font-bold flex items-center"><CheckCircle className="h-5 w-5 mr-2" /> Propuesta Aceptada</p>
                                ) : (
                                    canAccept && (
                                        <button onClick={() => onAccept(p._id)} className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
                                            Aceptar Propuesta
                                        </button>
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export const QuoteRequestDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();
    const [request, setRequest] = useState<QuoteRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRequestDetails = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await quoteRequestService.getQuoteRequestById(id);
            setRequest(response);
        } catch {
            setError('No se pudo cargar la solicitud.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchRequestDetails();
    }, [fetchRequestDetails]);

    const handleAcceptProposal = async (proposalId: string) => {
        if (!id) return;
        try {
            await quoteRequestService.acceptProposal(id, proposalId);
            fetchRequestDetails(); // Refresh data
        } catch {
            showToast('Error al aceptar la propuesta.', 'error');
        }
    };

    const isClientOwner = useMemo(() => user && request && user.id === request.clientId.id, [user, request]);
    const technicianHasProposed = useMemo(() => user && request && request.proposals.some(p => p.technicianId.id === user.id), [user, request]);

    if (loading) return <div className="text-center p-8">Cargando...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
    if (!request) return <div className="text-center p-8">Solicitud no encontrada.</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <button onClick={() => navigate(-1)} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                </button>

                <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{request.category}</h1>
                    <div className="flex items-center text-sm text-gray-500 mt-2 mb-4">
                        <MapPin className="h-4 w-4 mr-2" /> {request.location}
                        <span className="mx-2">|</span>
                        <Calendar className="h-4 w-4 mr-2" /> Creada el {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    
                    <p className="text-gray-700 whitespace-pre-wrap mb-6">{request.description}</p>

                    {request.images && request.images.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-2">Imágenes Adjuntas</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {request.images.map(img => (
                                    <a key={img} href={`${API_BASE_URL}${img}`} target="_blank" rel="noopener noreferrer">
                                        <img src={`${API_BASE_URL}${img}`} alt="Imagen de la solicitud" className="w-full h-32 object-cover rounded-lg" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status Banner */}
                    {request.status !== 'pending' && request.status !== 'quoted' && (
                        <div className={`p-4 rounded-lg mb-6 flex items-center ${request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {request.status === 'in_progress' ? <Wrench className="h-5 w-5 mr-3" /> : <CheckCircle className="h-5 w-5 mr-3" />}
                            <div>
                                <p className="font-bold">{request.status === 'in_progress' ? 'Trabajo en Progreso' : 'Trabajo Completado'}</p>
                                {request.selectedTechnicianId && <p className="text-sm">Técnico: {request.selectedTechnicianId.name}</p>}
                            </div>
                        </div>
                    )}

                    {/* Client's View */}
                    {isClientOwner && <ProposalsList request={request} onAccept={handleAcceptProposal} />}

                    {/* Technician's View */}
                    {user && user.type === 'technician' && !isClientOwner && (
                        request.status === 'pending' || (request.status === 'quoted' && !technicianHasProposed) ? (
                            <ProposalForm quoteRequestId={request._id} onProposalSubmitted={fetchRequestDetails} />
                        ) : (
                            technicianHasProposed && <div className="text-center p-4 bg-green-100 rounded-lg">Ya has enviado una propuesta.</div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};