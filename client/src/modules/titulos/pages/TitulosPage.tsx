import { useState } from 'react';
import { TitulosList } from '../components/TitulosList';
import { TituloForm } from '../components/TituloForm';
import { Titulo } from '../types';
import '../styles/TitulosPage.css';

export function TitulosPage() {
  const [showForm, setShowForm] = useState(false);
  const [tituloToEdit, setTituloToEdit] = useState<Titulo | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (titulo: Titulo) => {
    setTituloToEdit(titulo);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setTituloToEdit(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setTituloToEdit(null);
  };

  const handleNewTitulo = () => {
    setTituloToEdit(null);
    setShowForm(true);
  };

  return (
    <div className="titulos-page">
      <h1>Gerenciamento de Títulos</h1>

      <div className="page-actions">
        <button onClick={handleNewTitulo}>Novo Título</button>
      </div>

      {showForm ? (
        <TituloForm
          tituloToEdit={tituloToEdit}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <TitulosList onEdit={handleEdit} refresh={refreshKey} />
      )}
    </div>
  );
}
