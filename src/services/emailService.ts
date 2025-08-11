import emailjs from '@emailjs/browser';

// Configuration EmailJS
let EMAILJS_SERVICE_ID = 'ton_service_id';
let EMAILJS_TEMPLATE_ID = 'ton_template_id';
let EMAILJS_PUBLIC_KEY = 'ton_public_key';

// Initialiser EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export const sendReceiptByEmail = async (receiptData: any, customerEmail: string) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('mg-MG', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0
    }).format(amount).replace('MGA', 'Ar');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Espèces',
      card: 'Carte bancaire',
      mvola: 'MVola',
      orange_money: 'Orange Money',
      airtel_money: 'Airtel Money'
    };
    return labels[method] || method;
  };

  // Générer le contenu détaillé des articles
  const itemsContent = receiptData.items.map((item: any) => 
    `${item.name} x${item.quantity} - ${formatCurrency(item.total)}`
  ).join('\n');

  const templateParams = {
    to_email: customerEmail,
    to_name: receiptData.customerName || 'Client',
    receipt_number: receiptData.receiptNumber,
    date: formatDate(receiptData.date),
    cashier_name: receiptData.cashierName,
    customer_name: receiptData.customerName || 'Client',
    establishment_name: receiptData.establishmentInfo.name,
    establishment_address: receiptData.establishmentInfo.address,
    establishment_phone: receiptData.establishmentInfo.phone,
    establishment_email: receiptData.establishmentInfo.email,
    items_content: itemsContent,
    subtotal: formatCurrency(receiptData.subtotal),
    tax_amount: formatCurrency(receiptData.taxAmount),
    total_amount: formatCurrency(receiptData.total),
    payment_method: getPaymentMethodLabel(receiptData.paymentMethod),
    payment_amount: formatCurrency(receiptData.paymentAmount),
    change_amount: receiptData.changeAmount > 0 ? formatCurrency(receiptData.changeAmount) : '',
    has_change: receiptData.changeAmount > 0 ? 'Oui' : 'Non'
  };

  try {
    console.log('📧 Envoi du reçu par email via EmailJS...', {
      to: customerEmail,
      receiptNumber: receiptData.receiptNumber
    });

    const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    
    console.log('✅ Email envoyé avec succès:', response);
    return { success: true, message: 'Email envoyé avec succès' };
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:', error);
    return { 
      success: false, 
      message: 'Erreur lors de l\'envoi de l\'email',
      error: error 
    };
  }
};

// Fonction pour tester la configuration EmailJS
export const testEmailJSConfiguration = async () => {
  try {
    // Test avec des données fictives
    const testParams = {
      to_email: 'test@example.com',
      to_name: 'Test Client',
      receipt_number: 'TEST-001',
      establishment_name: 'Test Establishment'
    };

    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, testParams);
    return { success: true, message: 'Configuration EmailJS valide' };
  } catch (error) {
    return { 
      success: false, 
      message: 'Configuration EmailJS invalide',
      error: error 
    };
  }
};

// Fonction pour mettre à jour la configuration EmailJS
export const updateEmailJSConfig = (serviceId: string, templateId: string, publicKey: string) => {
  // Note: En production, ces valeurs devraient être dans des variables d'environnement
  console.log('🔧 Mise à jour de la configuration EmailJS');
  
  // Mettre à jour les variables de configuration
  EMAILJS_SERVICE_ID = serviceId;
  EMAILJS_TEMPLATE_ID = templateId;
  EMAILJS_PUBLIC_KEY = publicKey;
  
  emailjs.init(publicKey);
  
  // Retourner les nouvelles valeurs pour validation
  return {
    serviceId,
    templateId,
    publicKey: publicKey.substring(0, 8) + '...' // Masquer la clé pour la sécurité
  };
};