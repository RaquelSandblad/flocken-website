'use client';

import Link from 'next/link';

export function TermsPT() {
  return (
    <>
      <h1>Termos de Uso</h1>
      
      <p className="lead">
        <strong>Última atualização:</strong> 12 de fevereiro de 2026
      </p>
      
      <p>Bem-vindo à Flocken! Estes termos de uso (&quot;Termos&quot;) regem o seu uso do aplicativo móvel Flocken (&quot;Aplicativo&quot;, &quot;Serviço&quot;) fornecido pela Spitakolus AB (&quot;nós&quot;, &quot;nos&quot;, &quot;nosso&quot;).</p>
      <p>Ao criar uma conta e usar a Flocken, você concorda com estes termos. Se você não concordar com os termos, por favor não use o serviço.</p>
      
      <h2 id="definitioner">1. Definições</h2>
      <ul>
        <li><strong>&quot;Usuário&quot;:</strong> Pessoa que criou uma conta na Flocken</li>
        <li><strong>&quot;Perfil de cão&quot;:</strong> Perfil de um cão criado por um usuário</li>
        <li><strong>&quot;Hundar&quot;:</strong> Função para combinar cães para acasalamento ou brincadeira</li>
        <li><strong>&quot;Passa&quot;:</strong> Função para encontrar e reservar cuidadores de cães</li>
        <li><strong>&quot;Rasta&quot;:</strong> Função para rastrear e compartilhar passeios</li>
        <li><strong>&quot;Besöka&quot;:</strong> Função para encontrar lugares que aceitam cães</li>
        <li><strong>&quot;Conteúdo&quot;:</strong> Todas as informações, imagens, texto e dados carregados pelos usuários</li>
        <li><strong>&quot;Assinatura&quot;:</strong> Acesso pago aos recursos do aplicativo através de assinatura mensal ou anual</li>
      </ul>
      
      <h2 id="konto">2. Conta e Registro</h2>
      
      <h3 id="konto-skapa">2.1 Criar Conta</h3>
      <ul>
        <li>Você deve fornecer informações corretas e completas</li>
        <li>Você é responsável por manter suas credenciais de login seguras</li>
        <li>Uma conta não pode ser compartilhada com outras pessoas</li>
        <li>Você é responsável por toda a atividade que ocorre através de sua conta</li>
        <li>Reservamo-nos o direito de encerrar ou suspender contas que violem estes termos</li>
      </ul>
      
      <h3 id="konto-foraldrar">2.2 Responsabilidade Parental</h3>
      <p>Se você é pai ou responsável e permite que seu filho use a Flocken, você é responsável por:</p>
      <ul>
        <li>Supervisionar o uso do aplicativo pela criança</li>
        <li>Toda a atividade que ocorre através da conta da criança</li>
        <li>Garantir que o uso da criança siga estes termos de uso</li>
        <li>Quaisquer assinaturas ou pagamentos feitos através da conta da criança</li>
        <li>Garantir que a criança não compartilhe informações pessoais com desconhecidos</li>
      </ul>
      <p>Recomendamos que os pais se envolvam ativamente no uso de aplicativos sociais por seus filhos e discutam o uso seguro da internet.</p>
      
      <h3 id="konto-typer">2.3 Tipos de Conta</h3>
      <p>A Flocken oferece quatro tipos de conta:</p>
      <ul>
        <li><strong>Dono de cão (dog_owner):</strong> Para indivíduos que desejam anunciar seus cães para acasalamento ou brincadeira. Máximo de 3 cães podem ser anunciados.</li>
        <li><strong>Cuidador de cães (dog_sitter):</strong> Para indivíduos que desejam apenas oferecer serviços de cuidados de cães. Não podem anunciar cães para acasalamento.</li>
        <li><strong>Canil (kennel):</strong> Para canis e criadores registrados. Podem anunciar número ilimitado de cães.</li>
        <li><strong>Creche para cães (dog_daycare):</strong> Para empresas que oferecem creches e serviços de cuidados de cães. Podem anunciar número ilimitado de cães.</li>
      </ul>
      <p>Você pode atualizar ou alterar seu tipo de conta a qualquer momento nas configurações do aplicativo.</p>
      
      <h2 id="prenumeration">3. Assinatura e Pagamento</h2>
      
      <h3 id="pren-betalning">3.1 Pagamento e Faturamento</h3>
      <ul>
        <li>O pagamento é feito através da Apple App Store (para iOS) ou Google Play Store (para Android) de acordo com seus respectivos termos e regras</li>
        <li>Os preços são indicados incluindo impostos</li>
        <li>Todos os pagamentos são processados pela Apple ou Google – não recebemos pagamentos diretamente</li>
        <li>Você receberá um recibo por e-mail após cada pagamento da respectiva plataforma</li>
        <li>Para reembolsos, siga as regras da Apple App Store ou Google Play Store</li>
      </ul>
      
      <h3 id="pren-fornyelse">3.2 Renovação Automática</h3>
      <ul>
        <li>A assinatura é válida por tempo indeterminado e renovada automaticamente a cada mês/ano de acordo com o período escolhido</li>
        <li>A renovação ocorre automaticamente no final de cada período se você não cancelar a assinatura</li>
        <li>Para desativar a renovação automática, você deve cancelar a assinatura nas configurações da App Store ou Google Play</li>
        <li>O cancelamento deve ocorrer antes do próximo período de faturamento para evitar cobrança</li>
        <li>Ao cancelar, você mantém o acesso aos recursos premium até o final do período</li>
      </ul>
      
      <h3 id="pren-trial">3.3 Períodos de Teste</h3>
      <ul>
        <li>Podemos oferecer períodos de teste onde você pode experimentar o aplicativo gratuitamente</li>
        <li>Durante o período de teste, você não precisa inserir informações de pagamento</li>
        <li>Você não se compromete a continuar com uma versão paga após o período de teste</li>
        <li>Se você optar por não pagar após o período de teste, poderá continuar usando o aplicativo em uma versão gratuita limitada</li>
        <li>A duração e os termos dos períodos de teste são especificados no aplicativo quando a oferta é feita</li>
      </ul>
      
      <h3 id="pren-uppsagning">3.4 Cancelamento</h3>
      <ul>
        <li>Você pode cancelar a assinatura a qualquer momento nas configurações da App Store ou Google Play</li>
        <li>O cancelamento deve ocorrer antes do início do próximo período de faturamento</li>
        <li>O cancelamento entra em vigor no próximo período de faturamento</li>
        <li>Não há reembolso para períodos já pagos</li>
        <li>Ao cancelar, você mantém o acesso aos recursos premium até o final do período</li>
        <li>Após o cancelamento, sua conta muda automaticamente para uma versão gratuita limitada</li>
        <li>Você pode atualizar para a versão premium novamente a qualquer momento</li>
      </ul>
      
      <h3 id="pren-priser-andring">3.5 Preços e Alterações de Preços</h3>
      <ul>
        <li>Os preços das assinaturas são mostrados no aplicativo e podem variar dependendo do tipo de conta e período escolhido</li>
        <li>Podemos oferecer promoções e descontos que afetam os preços</li>
        <li>Os preços são indicados incluindo impostos</li>
        <li>Reservamo-nos o direito de alterar os preços</li>
        <li>As alterações de preços são notificadas com pelo menos 30 dias de antecedência por e-mail e no aplicativo</li>
        <li>Se você não concordar com os novos preços, pode cancelar a assinatura antes que a alteração entre em vigor</li>
        <li>Se você continuar usando o serviço após a alteração de preço, você concorda automaticamente com os novos preços</li>
      </ul>
      
      <h2 id="funktioner">4. Recursos do Serviço</h2>
      
      <h3 id="funk-hundar">4.1 Hundar (Combinação de Cães)</h3>
      <p><strong>Uso permitido:</strong></p>
      <ul>
        <li>Encontrar cães para acasalamento ou brincadeira</li>
        <li>Filtrar por raça, tamanho, testes de saúde e outros critérios</li>
        <li>Contactar outros donos de cães através da função de mensagens do aplicativo</li>
        <li>Criar perfis de cães com imagens e informações</li>
      </ul>
      <p><strong>Responsabilidade do usuário:</strong></p>
      <ul>
        <li>Você é responsável por fornecer informações corretas sobre seu cão</li>
        <li>Os testes de saúde e pedigrees devem ser autênticos e verificáveis</li>
        <li>Você é responsável por todos os acordos com outros usuários</li>
        <li>A Flocken não é parte de nenhum acordo entre usuários</li>
        <li>Não assumimos qualquer responsabilidade pelo resultado de acasalamentos que ocorram através do aplicativo</li>
        <li>Você é responsável por seguir a legislação sueca de proteção animal e diretrizes éticas para criação de cães</li>
      </ul>
      
      <h3 id="funk-passa">4.2 Passa (Serviços de Cuidados de Cães)</h3>
      <p><strong>Para cuidadores de cães:</strong></p>
      <ul>
        <li>Você deve fornecer informações corretas sobre experiência e serviços</li>
        <li>Você é responsável pela segurança do cão durante os cuidados</li>
        <li>Você deve ter seguro adequado que cubra serviços de cuidados de cães</li>
        <li>Você é responsável por seguir todas as instruções do dono do cão</li>
        <li>Você deve informar o dono do cão sobre quaisquer incidentes ou problemas imediatamente</li>
      </ul>
      <p><strong>Para donos de cães:</strong></p>
      <ul>
        <li>Você é responsável por dar instruções corretas sobre as necessidades do cão</li>
        <li>Você deve informar sobre necessidades médicas, alergias ou problemas de comportamento</li>
        <li>Você é responsável por garantir que seu cão esteja vacinado e saudável</li>
        <li>O pagamento pelos serviços de cuidados de cães ocorre diretamente entre você e o cuidador – a Flocken não cobra nenhuma comissão</li>
        <li>Você é responsável por garantir que o cuidador tenha seguro adequado</li>
      </ul>
      <p><strong>Limitação de responsabilidade:</strong></p>
      <ul>
        <li>A Flocken é uma plataforma de intermediação – não somos o serviço de cuidados de cães</li>
        <li>Não verificamos a competência, adequação ou seguros dos cuidadores de cães</li>
        <li>Todos os acordos sobre cuidados são entre você e o cuidador</li>
        <li>Não somos responsáveis por danos, perdas ou acidentes durante os cuidados</li>
        <li>O usuário deve garantir seguro adequado e proteção legal por conta própria</li>
        <li>Reservamo-nos o direito de remover usuários que violem estas regras</li>
      </ul>
      
      <h3 id="funk-rasta">4.3 Rasta (Rastreamento de Passeios)</h3>
      <p><strong>Uso permitido:</strong></p>
      <ul>
        <li>Rastrear seus passeios com GPS</li>
        <li>Salvar rotas privadas ou compartilhá-las publicamente</li>
        <li>Ver rotas compartilhadas por outros</li>
        <li>Acumular pontos com base na distância</li>
        <li>Compartilhar passeios com amigos</li>
      </ul>
      <p><strong>Responsabilidade do usuário:</strong></p>
      <ul>
        <li>Você é responsável por seguir as regras e leis locais durante os passeios</li>
        <li>Você é responsável por manter seu cão na coleira onde for exigido</li>
        <li>Os dados de GPS são armazenados de acordo com nossa política de privacidade</li>
      </ul>
      
      <h3 id="funk-besoka">4.4 Besöka (Lugares que Aceitam Cães)</h3>
      <p><strong>Uso permitido:</strong></p>
      <ul>
        <li>Encontrar cafés, restaurantes e bares que aceitam cães</li>
        <li>Adicionar lugares ausentes</li>
        <li>Filtrar por categoria</li>
        <li>Deixar avaliações e classificações</li>
      </ul>
      <p><strong>Responsabilidade do usuário:</strong></p>
      <ul>
        <li>Você é responsável por garantir que as informações que você adiciona estejam corretas</li>
        <li>As avaliações devem ser honestas e baseadas em experiências reais</li>
        <li>Reservamo-nos o direito de remover informações incorretas ou inadequadas</li>
      </ul>
      
      <h2 id="innehall">5. Conteúdo Gerado pelo Usuário</h2>
      
      <h3 id="innehall-ansvar">5.1 Sua Responsabilidade</h3>
      <p>Você é responsável por todo o conteúdo que você carrega, incluindo:</p>
      <ul>
        <li>Imagens de cães</li>
        <li>Descrições e textos de perfil</li>
        <li>Mensagens para outros usuários</li>
        <li>Avaliações de cuidadores de cães e lugares</li>
        <li>Passeios compartilhados</li>
        <li>Comentários e interações</li>
      </ul>
      
      <h3 id="innehall-forbud">5.2 Conteúdo Proibido</h3>
      <p>O seguinte é proibido:</p>
      <ul>
        <li>Conteúdo ilegal ou conteúdo que encoraje atividades ilegais</li>
        <li>Conteúdo ofensivo, ameaçador ou assediador</li>
        <li>Informações falsas ou enganosas</li>
        <li>Material pornográfico ou violento</li>
        <li>Spam ou marketing sem permissão</li>
        <li>Material protegido por direitos autorais que você não tem o direito de usar</li>
        <li>Dados pessoais de outras pessoas sem seu consentimento</li>
        <li>Conteúdo que viola a proteção animal ou diretrizes éticas</li>
      </ul>
      
      <h3 id="innehall-licens">5.3 Licença para Nós</h3>
      <p>Ao carregar conteúdo, você nos concede uma licença não exclusiva, global e livre de royalties para usar, exibir e distribuir o conteúdo dentro do serviço. Isso é necessário para que o aplicativo funcione (por exemplo, mostrar as imagens do seu cão para outros usuários). Você mantém a propriedade do seu conteúdo.</p>
      <p>Reservamo-nos o direito de remover, editar ou moderar conteúdo que viole estes termos sem aviso prévio.</p>
      
      <h3 id="innehall-rapportering">5.4 Relatar Conteúdo Inadequado</h3>
      <p>Se você encontrar conteúdo que viole estes termos, por favor relate-o através da função de relatório do aplicativo ou entre em contato conosco em support@spitakolus.com.</p>
      
      <h3 id="innehall-community">5.5 Diretrizes da Comunidade</h3>
      <p>Para manter um ambiente seguro e agradável para todos os usuários, esperamos que você:</p>
      <ul>
        <li><strong>Seja respeitoso:</strong> Trate outros usuários com respeito e cortesia</li>
        <li><strong>Seja honesto:</strong> Forneça informações verdadeiras sobre você e seu cão</li>
        <li><strong>Siga as leis:</strong> Siga todas as leis e regulamentos aplicáveis, especialmente a legislação de proteção animal</li>
        <li><strong>Proteja a segurança dos outros:</strong> Relate imediatamente se você suspeitar que alguém está em perigo</li>
        <li><strong>Respeite a privacidade:</strong> Não compartilhe dados pessoais de outras pessoas sem seu consentimento</li>
        <li><strong>Comunique-se construtivamente:</strong> Evite conflitos, assédio e comportamento ameaçador</li>
        <li><strong>Assuma responsabilidade em encontros de cães:</strong> Certifique-se de que os encontros de cães ocorram em lugares seguros e que todas as partes estejam confortáveis</li>
      </ul>
      <p><strong>Nossa responsabilidade e direito de moderar:</strong></p>
      <ul>
        <li>Monitoramos e moderamos conteúdo e comportamento no aplicativo</li>
        <li>Podemos revisar conteúdo relatado e tomar medidas em caso de violações</li>
        <li>Podemos remover conteúdo que viole estas diretrizes sem aviso prévio</li>
        <li>Podemos emitir avisos, suspensões temporárias ou permanentes em caso de violações repetidas ou graves</li>
        <li>Cooperamos com as autoridades em caso de suspeita de crime</li>
        <li>Nossas decisões sobre moderação são finais, mas você pode entrar em contato conosco em support@spitakolus.com se acreditar que uma decisão está incorreta</li>
      </ul>
      
      <h2 id="integritet">6. Privacidade e Proteção de Dados</h2>
      
      <h3 id="integritet-behandling">6.1 Tratamento de Dados Pessoais</h3>
      <p>Coletamos e tratamos dados pessoais de acordo com nossa política de privacidade, que segue o GDPR e a legislação sueca de proteção de dados. Ao usar o serviço, você concorda com nosso tratamento de dados pessoais de acordo com a política de privacidade.</p>
      <p>Para mais informações sobre como tratamos seus dados pessoais, consulte nossa <Link href="/integritetspolicy?lang=pt" className="text-flocken-olive hover:underline">política de privacidade</Link>.</p>
      
      <h3 id="integritet-rattigheter">6.2 Seus Direitos</h3>
      <p>Você tem o direito de:</p>
      <ul>
        <li>Obter acesso aos seus dados pessoais</li>
        <li>Corrigir dados incorretos</li>
        <li>Excluir sua conta e seus dados</li>
        <li>Exportar seus dados (portabilidade de dados)</li>
        <li>Objetar contra certos tratamentos</li>
        <li>Retirar seu consentimento</li>
      </ul>
      <p>Para exercer seus direitos ou obter mais informações, visite nossa página de <Link href="/privacy-choices?lang=pt" className="text-flocken-olive hover:underline">configurações de privacidade</Link> ou entre em contato conosco em support@spitakolus.com.</p>
      
      <h2 id="ansvar">7. Limitação de Responsabilidade</h2>
      
      <h3 id="ansvar-tjanst">7.1 Disponibilidade do Serviço</h3>
      <p>Nos esforçamos para alta disponibilidade, mas não podemos garantir que o serviço esteja sempre disponível ou livre de erros. Não somos responsáveis por:</p>
      <ul>
        <li>Interrupções no serviço (planejadas ou não planejadas)</li>
        <li>Perda de dados</li>
        <li>Erros técnicos ou bugs</li>
        <li>Serviços de terceiros que não funcionam ou estão indisponíveis</li>
        <li>Perdas que surgem devido a problemas técnicos</li>
      </ul>
      
      <h3 id="ansvar-anvandare">7.2 Interações do Usuário</h3>
      <p>A Flocken é uma plataforma para conectar donos de cães. Não somos responsáveis por:</p>
      <ul>
        <li>Acordos ou transações entre usuários</li>
        <li>Comportamento ou ações de outros usuários</li>
        <li>Danos que ocorram durante encontros de cães, cuidados ou outras atividades</li>
        <li>Conteúdo falso ou enganoso de usuários</li>
        <li>Questões veterinárias ou problemas de saúde em cães</li>
        <li>Perdas financeiras que surgem em conexão com o uso do serviço</li>
      </ul>
      
      <h3 id="ansvar-max">7.3 Responsabilidade Máxima</h3>
      <p>Nossa responsabilidade total para com você é limitada ao valor que você pagou pela assinatura nos últimos 12 meses. Não somos responsáveis por danos indiretos, lucros cessantes ou outras consequências.</p>
      
      <h3 id="ansvar-force-majeure">7.4 Força Maior</h3>
      <p>Não somos responsáveis por atrasos ou não cumprimento de nossas obrigações sob estes termos se isso for causado por circunstâncias além de nosso controle razoável, incluindo mas não limitado a:</p>
      <ul>
        <li>Desastres naturais (inundações, terremotos, tempestades, etc.)</li>
        <li>Guerra, terrorismo ou distúrbios civis</li>
        <li>Pandemias ou epidemias</li>
        <li>Greves ou conflitos trabalhistas</li>
        <li>Interrupções de energia ou interrupções nas telecomunicações</li>
        <li>Ataques cibernéticos ou sabotagem</li>
        <li>Decisões das autoridades, mudanças na lei ou outras medidas regulatórias</li>
        <li>Erros ou interrupções em provedores terceirizados que estão além de nosso controle</li>
      </ul>
      <p>Em tais circunstâncias, nossas obrigações serão adiadas durante o tempo em que o impedimento persistir. Se o impedimento durar mais de 60 dias, tanto você quanto nós temos o direito de rescindir o contrato sem obrigação de compensação.</p>
      
      <h2 id="upphovsratt">8. Direitos Autorais e Direitos de Propriedade Intelectual</h2>
      <p>O aplicativo, incluindo seu design, logotipo, texto e código, é protegido por direitos autorais e outros direitos de propriedade intelectual que pertencem à Spitakolus AB ou aos nossos licenciadores. Você não pode copiar, modificar ou distribuir o aplicativo sem nossa permissão por escrito.</p>
      
      <h2 id="uppsagning">9. Rescisão do Serviço</h2>
      
      <h3 id="uppsagning-anvandare">9.1 Rescisão por Você</h3>
      <p>Você pode encerrar sua conta a qualquer momento excluindo-a nas configurações do aplicativo ou entrando em contato conosco em support@spitakolus.com.</p>
      
      <h3 id="uppsagning-oss">9.2 Rescisão por Nós</h3>
      <p>Reservamo-nos o direito de encerrar ou suspender sua conta imediatamente se você violar estes termos, sem aviso prévio. Também podemos encerrar o serviço completamente com aviso de 30 dias.</p>
      
      <h2 id="andringar">10. Alterações nos Termos</h2>
      <p>Reservamo-nos o direito de alterar estes termos a qualquer momento. Alterações significativas serão notificadas por e-mail e no aplicativo pelo menos 30 dias antes de entrarem em vigor. Se você continuar usando o serviço após as alterações entrarem em vigor, você concorda com os novos termos.</p>
      
      <h2 id="tvist">11. Resolução de Disputas e Lei Aplicável</h2>
      
      <h3 id="tvist-lag">11.1 Lei Aplicável</h3>
      <p>Estes termos são regidos pela lei sueca.</p>
      
      <h3 id="tvist-losning">11.2 Resolução de Disputas</h3>
      <p>As disputas devem ser resolvidas primeiro através de negociação entre você e nós. Se a negociação não levar a uma solução, a disputa deve ser decidida por um tribunal geral sueco.</p>
      
      <h3 id="tvist-konsument">11.3 Disputas do Consumidor</h3>
      <p>Se você for um consumidor, também pode recorrer ao Conselho Nacional de Reclamações do Consumidor Sueco (ARN) para resolução de disputas.<br /><strong>Site:</strong>{' '}<a href="https://www.arn.se" target="_blank" rel="noopener noreferrer" className="text-flocken-olive hover:underline">www.arn.se</a></p>
      
      <h2 id="ovrigt">12. Diversos</h2>
      
      <h3 id="ovrigt-delning">12.1 Divisibilidade dos Termos</h3>
      <p>Se alguma parte destes termos for inválida ou inexequível, isso não afeta a validade das partes restantes.</p>
      
      <h3 id="ovrigt-hela">12.2 Acordo Completo</h3>
      <p>Estes termos constituem o acordo completo entre você e nós em relação ao uso do serviço.</p>
      
      <h2 id="kontakt">13. Entre em Contato Conosco</h2>
      <p>Se você tiver dúvidas sobre estes termos, entre em contato conosco:</p>
      <ul>
        <li><strong>E-mail:</strong> support@spitakolus.com</li>
        <li><strong>Endereço postal:</strong> Spitakolus AB, Svängrumsgatan 46, 421 71 Västra Frölunda, Suécia</li>
        <li><strong>Número de registro:</strong> 559554-6101</li>
        <li><strong>Assunto:</strong> Escreva &quot;Termos de Uso&quot; na linha de assunto</li>
      </ul>
      
      <p className="mt-8 text-sm text-flocken-gray">
        Estes termos de uso foram atualizados pela última vez em 12 de fevereiro de 2026 e entram em vigor imediatamente.
      </p>
    </>
  );
}
