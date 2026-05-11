'use client';

export function PrivacyChoicesPT() {
  return (
    <>
      <h1>Gerenciar Suas Escolhas de Privacidade</h1>
      
      <p className="lead">
        Aqui você encontra informações sobre como gerenciar, alterar ou excluir seus dados pessoais na Flocken.
      </p>
      
      <h2 id="radera-konto">Excluir Sua Conta</h2>
      <p>
        Você pode excluir sua conta a qualquer momento diretamente no aplicativo Flocken:
      </p>
      <ol>
        <li>Abra o aplicativo e vá para o seu perfil</li>
        <li>Selecione "Configurações"</li>
        <li>Role para baixo até "Excluir conta"</li>
        <li>Siga as instruções para confirmar a exclusão</li>
      </ol>
      <p>
        <strong>O que acontece quando você exclui sua conta:</strong>
      </p>
      <ul>
        <li>Seu perfil e todas as informações pessoais são removidos</li>
        <li>Informações sobre seu cão (imagens, descrição, dados) são excluídas</li>
        <li>Mensagens de chat são excluídas</li>
        <li>Marcações de favoritos e configurações são removidas</li>
        <li>A exclusão ocorre dentro de um prazo razoável, normalmente dentro de 30 dias</li>
      </ul>
      <p>
        <strong>Nota:</strong> Alguns dados podem precisar ser mantidos se exigido por lei (por exemplo, requisitos contábeis ou investigações em andamento).
      </p>
      
      <h2 id="ändra-uppgifter">Alterar Seus Dados</h2>
      <p>
        Você pode alterar seus dados a qualquer momento diretamente no aplicativo:
      </p>
      
      <h3>Editar Seu Perfil</h3>
      <ul>
        <li>Vá para o seu perfil no aplicativo</li>
        <li>Toque em "Editar perfil"</li>
        <li>Altere nome, e-mail, telefone, foto de perfil ou outras informações</li>
        <li>Salve suas alterações</li>
      </ul>
      
      <h3>Editar Informações do Seu Cão</h3>
      <ul>
        <li>Vá para o perfil do seu cão no aplicativo</li>
        <li>Toque em "Editar"</li>
        <li>Atualize nome, raça, idade, imagens, descrição ou outras informações</li>
        <li>Salve suas alterações</li>
      </ul>
      
      <h3>Remover Imagens</h3>
      <p>
        Você pode remover imagens que você carregou a qualquer momento abrindo a imagem no aplicativo e selecionando "Remover".
      </p>
      
      <h2 id="hantera-platsdata">Gerenciar Dados de Localização</h2>
      <p>
        Os dados de localização são coletados apenas quando você inicia ativamente um passeio na função Rasta.
      </p>
      <ul>
        <li><strong>Desativar acesso à localização:</strong> Você pode desativar o acesso à localização a qualquer momento nas configurações do seu dispositivo. A função Rasta não estará disponível, mas outras funções funcionarão.</li>
        <li><strong>Excluir passeios salvos:</strong> Você pode excluir passeios individuais diretamente no aplicativo em "Meus passeios".</li>
        <li><strong>Passeios privados vs visíveis:</strong> Você escolhe se um passeio deve ser privado ou visível para outros usuários.</li>
      </ul>
      
      <h2 id="hantera-meddelanden">Gerenciar Mensagens</h2>
      <p>
        Você pode excluir conversas de chat diretamente no aplicativo:
      </p>
      <ul>
        <li>Abra a conversa que deseja excluir</li>
        <li>Selecione "Excluir conversa"</li>
        <li>As mensagens são excluídas permanentemente de nossos servidores</li>
      </ul>
      
      <h2 id="exportera-data">Exportar Seus Dados (portabilidade de dados)</h2>
      <p>
        Você tem o direito de obter seus dados pessoais em um formato estruturado e legível por máquina.
      </p>
      <p>
        Para solicitar uma cópia dos seus dados, entre em contato conosco por e-mail em{' '}
        <a href="mailto:support@spitakolus.com" className="text-flocken-olive hover:underline">
          support@spitakolus.com
        </a>.
      </p>
      <p>
        Enviaremos então uma cópia dos seus dados para o seu endereço de e-mail registrado dentro de 30 dias.
      </p>
      
      <h2 id="andra-rättigheter">Outros Direitos</h2>
      <p>
        Se você deseja exercer outros direitos como:
      </p>
      <ul>
        <li>Solicitar restrição de tratamento</li>
        <li>Objetar contra tratamento baseado em interesse legítimo</li>
        <li>Retirar o consentimento</li>
        <li>Apresentar uma reclamação à autoridade supervisora</li>
      </ul>
      <p>
        Entre em contato conosco através de{' '}
        <a href="mailto:support@spitakolus.com" className="text-flocken-olive hover:underline">
          support@spitakolus.com
        </a>{' '}
        ou leia mais em nossa{' '}
        <a href="/integritetspolicy?lang=pt" className="text-flocken-olive hover:underline">
          política de privacidade
        </a>.
      </p>
      
      <h2 id="kontakt-support">Contato</h2>
      <p>
        Para perguntas sobre o gerenciamento de seus dados pessoais ou para exercer seus direitos:
      </p>
      <p>
        <strong>Spitakolus AB</strong><br />
        E-mail:{' '}
        <a href="mailto:support@spitakolus.com" className="text-flocken-olive hover:underline">
          support@spitakolus.com
        </a><br />
        Número de registro: 559554-6101
      </p>
    </>
  );
}
