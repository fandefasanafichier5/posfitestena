import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Card } from './Card';
import { 
  Mail, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  EyeOff,
  ExternalLink,
  Copy,
  TestTube,
  FileText,
  Key,
  X
} from 'lucide-react';
import { updateEmailJSConfig, testEmailJSConfiguration } from '../../services/emailService';
import { getEmailJSConfig } from '../../services/emailService';
import toast from 'react-hot-toast';

interface EmailJSConfigProps {
  onClose?: () => void;
}

export const EmailJSConfig: React.FC<EmailJSConfigProps> = ({ onClose }) => {
  const [config, setConfig] = useState({
    serviceId: '',
    templateId: '',
    publicKey: ''
  });
  const [showKeys, setShowKeys] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Charger la configuration actuelle au montage du composant
  React.useEffect(() => {
    const currentConfig = getEmailJSConfig();
    setConfig({
      serviceId: currentConfig.serviceId,
      templateId: currentConfig.templateId,
      publicKey: currentConfig.publicKey
    });
    
    // Vérifier si EmailJS est déjà configuré avec des valeurs valides
    if (currentConfig.publicKey !== 'ton_public_key' && 
        currentConfig.serviceId !== 'ton_service_id' && 
        currentConfig.templateId !== 'ton_template_id') {
      setIsConfigured(true);
    }
  }, []);

  const handleConfigUpdate = () => {
    if (!config.serviceId || !config.templateId || !config.publicKey) {
      toast.error('Tous les champs sont requis');
      return;
    }

    setIsSaving(true);
    try {
      const result = updateEmailJSConfig(config.serviceId, config.templateId, config.publicKey);
      setIsConfigured(true);
      toast.success('Configuration EmailJS mise à jour avec succès');
      console.log('Configuration mise à jour:', result);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la configuration');
      console.error('Erreur de configuration:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConfiguration = async () => {
    if (!isConfigured) {
      toast.error('Veuillez d\'abord configurer EmailJS');
      return;
    }

    setIsTesting(true);
    try {
      const result = await testEmailJSConfiguration();
      if (result.success) {
        toast.success('Configuration EmailJS valide !');
      } else {
        toast.error(`Test échoué: ${result.message}`);
        console.error('Erreur de test:', result.error);
      }
    } catch (error) {
      toast.error('Erreur lors du test de configuration');
      console.error('Erreur de test:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié dans le presse-papiers');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Mail className="w-6 h-6 mr-2 text-blue-600" />
          Configuration EmailJS
        </h2>
      </div>

      <Card>
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Settings className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Configuration EmailJS</h4>
              <div className="text-sm text-blue-700 mt-1 space-y-2">
                <p>1. Créez un compte gratuit sur <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">EmailJS.com</a></p>
                <p>2. Créez un service email (Gmail, Outlook, etc.)</p>
                <p>3. Créez un template d'email pour les reçus</p>
                <p>4. Copiez vos clés ci-dessous</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de configuration */}
        <div className="space-y-4">
          <Input
            label="Service ID"
            value={config.serviceId}
            onChange={(e) => setConfig({ ...config, serviceId: e.target.value })}
            placeholder="service_xxxxxxx"
            leftIcon={<Mail className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => copyToClipboard(config.serviceId)}
                className="text-gray-400 hover:text-gray-600"
                disabled={!config.serviceId}
              >
                <Copy className="w-4 h-4" />
              </button>
            }
          />

          <Input
            label="Template ID"
            value={config.templateId}
            onChange={(e) => setConfig({ ...config, templateId: e.target.value })}
            placeholder="template_xxxxxxx"
            leftIcon={<FileText className="w-4 h-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => copyToClipboard(config.templateId)}
                className="text-gray-400 hover:text-gray-600"
                disabled={!config.templateId}
              >
                <Copy className="w-4 h-4" />
              </button>
            }
          />

          <Input
            label="Public Key"
            type={showKeys ? 'text' : 'password'}
            value={config.publicKey}
            onChange={(e) => setConfig({ ...config, publicKey: e.target.value })}
            placeholder="user_xxxxxxxxxxxxxxx"
            leftIcon={<Key className="w-4 h-4" />}
            rightIcon={
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowKeys(!showKeys)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => copyToClipboard(config.publicKey)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={!config.publicKey}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            }
          />
        </div>
      </Card>

      <Card>
        {/* Template d'email suggéré */}
        <h4 className="text-sm font-medium text-gray-800 mb-3 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Template d'email suggéré pour EmailJS
        </h4>
        <div className="bg-white p-3 rounded border text-xs font-mono overflow-x-auto">
          <div className="text-gray-600 mb-2">Variables à utiliser dans votre template EmailJS :</div>
          <div className="space-y-1 text-gray-800">
            <div>• <span className="text-blue-600">{'{{to_name}}'}</span> - Nom du client</div>
            <div>• <span className="text-blue-600">{'{{receipt_number}}'}</span> - Numéro du reçu</div>
            <div>• <span className="text-blue-600">{'{{establishment_name}}'}</span> - Nom de l'établissement</div>
            <div>• <span className="text-blue-600">{'{{date}}'}</span> - Date de la vente</div>
            <div>• <span className="text-blue-600">{'{{total_amount}}'}</span> - Montant total</div>
            <div>• <span className="text-blue-600">{'{{items_content}}'}</span> - Liste des articles</div>
            <div>• <span className="text-blue-600">{'{{payment_method}}'}</span> - Méthode de paiement</div>
          </div>
        </div>
        <div className="mt-3">
          <a 
            href="https://dashboard.emailjs.com/admin/templates" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Créer un template sur EmailJS
          </a>
        </div>
      </Card>

      {/* Actions */}
      <Card>
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline"
            onClick={handleTestConfiguration}
            disabled={!isConfigured || isTesting}
          >
            {isTesting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Test en cours...
              </>
            ) : (
              <>
                <TestTube className="w-4 h-4 mr-2" />
                Tester la config
              </>
            )}
          </Button>
          
          <Button 
            onClick={handleConfigUpdate}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sauvegarde...
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                Sauvegarder la configuration
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Statut de configuration */}
      {isConfigured && (
        <Card>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Configuration mise à jour</h4>
                <p className="text-sm text-green-700 mt-1">
                  EmailJS est maintenant configuré. Vous pouvez tester l'envoi d'emails.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Aide */}
      <Card>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Aide et support</h4>
              <div className="text-sm text-yellow-700 mt-1 space-y-1">
                <p>• EmailJS offre 200 emails gratuits par mois</p>
                <p>• Assurez-vous que votre template contient toutes les variables nécessaires</p>
                <p>• Testez d'abord avec votre propre email</p>
                <p>• En cas de problème, vérifiez la console du navigateur</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};