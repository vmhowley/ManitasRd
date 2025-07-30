import { Layout } from '../../components/layout';
import { HelpDrawerExample } from '../../components/HelpDrawer';

const HelpDrawerExamplePage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Ejemplo de HelpDrawer</h1>
        
        <p className="text-lg mb-8">
          El componente HelpDrawer proporciona ayuda contextual para diferentes secciones de la aplicación.
          Haz clic en los botones de ayuda para ver el contenido contextual.
        </p>
        
        <HelpDrawerExample />
        
        <div className="mt-12 bg-white p-6 rounded-lg border border-neutral-200">
          <h2 className="text-2xl font-semibold mb-4">Cómo implementar HelpDrawer</h2>
          
          <div className="space-y-4">
            <p>
              Para implementar el sistema de ayuda contextual en tu aplicación, sigue estos pasos:
            </p>
            
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Envuelve tu aplicación con HelpProvider:</strong>
                <pre className="bg-neutral-100 p-3 rounded-md mt-2 overflow-x-auto">
                  <code>{`
<HelpProvider>
  <App />
</HelpProvider>
                  `}</code>
                </pre>
              </li>
              
              <li>
                <strong>Añade botones de ayuda donde los necesites:</strong>
                <pre className="bg-neutral-100 p-3 rounded-md mt-2 overflow-x-auto">
                  <code>{`
<div className="flex justify-between items-center">
  <h2>Título de la sección</h2>
  <HelpButton sectionId="mi-seccion" />
</div>
                  `}</code>
                </pre>
              </li>
              
              <li>
                <strong>Define el contenido de ayuda en el HelpProvider:</strong>
                <pre className="bg-neutral-100 p-3 rounded-md mt-2 overflow-x-auto">
                  <code>{`
// En HelpDrawer.tsx
const helpContentMap = {
  'mi-seccion': {
    title: 'Título de la Ayuda',
    content: (
      <div>
        <p>Contenido de ayuda para esta sección...</p>
      </div>
    ),
    links: [
      { text: 'Enlace a más información', url: '/help/mi-seccion' },
    ],
  },
};
                  `}</code>
                </pre>
              </li>
              
              <li>
                <strong>Usa el hook useHelp para controlar programáticamente:</strong>
                <pre className="bg-neutral-100 p-3 rounded-md mt-2 overflow-x-auto">
                  <code>{`
import { useHelp } from '../../components/HelpDrawer';

function MiComponente() {
  const { openHelp } = useHelp();
  
  return (
    <button onClick={() => openHelp('mi-seccion')}>
      Mostrar ayuda
    </button>
  );
}
                  `}</code>
                </pre>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpDrawerExamplePage;