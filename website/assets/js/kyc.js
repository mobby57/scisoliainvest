// KYC Application Logic
function kycApp() {
    return {
        // Status and Progress
        kycStatus: 'incomplete', // incomplete, pending, verified, rejected
        progress: 0,
        
        // Section toggles
        openSections: {
            personal: true,
            identity: false,
            address: false,
            financial: false
        },
        
        // Form steps completion
        steps: {
            personal: false,
            documents: false,
            address: false,
            verification: false
        },
        
        // Personal Information
        personalInfo: {
            firstName: '',
            lastName: '',
            birthDate: '',
            birthPlace: '',
            nationality: '',
            phone: '',
            address: ''
        },
        
        // Identity Documents
        identityDoc: {
            type: '',
            number: '',
            frontFile: null,
            backFile: null,
            uploaded: false
        },
        
        // Address Proof
        addressProof: {
            type: '',
            file: null,
            uploaded: false
        },
        
        // Financial Information
        financialInfo: {
            profession: '',
            employer: '',
            income: '',
            fundsSource: ''
        },
        
        // Agreements
        agreements: {
            terms: false,
            kyc: false,
            marketing: false
        },
        
        // UI State
        showSuccessModal: false,
        loading: false,
        
        // Initialize
        init() {
            this.loadSavedData();
            this.updateProgress();
            this.loadKYCStatus();
        },
        
        // Load saved data from localStorage
        loadSavedData() {
            const saved = localStorage.getItem('kyc_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.personalInfo = { ...this.personalInfo, ...data.personalInfo };
                this.identityDoc = { ...this.identityDoc, ...data.identityDoc };
                this.addressProof = { ...this.addressProof, ...data.addressProof };
                this.financialInfo = { ...this.financialInfo, ...data.financialInfo };
                this.agreements = { ...this.agreements, ...data.agreements };
                this.steps = { ...this.steps, ...data.steps };
            }
        },
        
        // Save data to localStorage
        saveData() {
            const data = {
                personalInfo: this.personalInfo,
                identityDoc: { ...this.identityDoc, frontFile: null, backFile: null },
                addressProof: { ...this.addressProof, file: null },
                financialInfo: this.financialInfo,
                agreements: this.agreements,
                steps: this.steps
            };
            localStorage.setItem('kyc_data', JSON.stringify(data));
        },
        
        // Load KYC status from API
        async loadKYCStatus() {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Mock response - in real app, this would come from API
                const mockStatus = localStorage.getItem('kyc_status') || 'incomplete';
                this.kycStatus = mockStatus;
                
                if (mockStatus === 'verified') {
                    this.steps = {
                        personal: true,
                        documents: true,
                        address: true,
                        verification: true
                    };
                }
            } catch (error) {
                console.error('Error loading KYC status:', error);
            }
        },
        
        // Toggle section visibility
        toggleSection(section) {
            this.openSections[section] = !this.openSections[section];
        },
        
        // Update progress based on completed steps
        updateProgress() {
            const completedSteps = Object.values(this.steps).filter(Boolean).length;
            this.progress = (completedSteps / 4) * 100;
        },
        
        // Get status text
        getStatusText() {
            const statusTexts = {
                incomplete: 'À compléter',
                pending: 'En cours de vérification',
                verified: 'Vérifié',
                rejected: 'Rejeté'
            };
            return statusTexts[this.kycStatus] || 'Inconnu';
        },
        
        // Save personal information
        async savePersonalInfo() {
            this.loading = true;
            
            try {
                // Validate required fields
                const required = ['firstName', 'lastName', 'birthDate', 'birthPlace', 'nationality', 'phone', 'address'];
                const isComplete = required.every(field => this.personalInfo[field]);
                
                if (!isComplete) {
                    alert('Veuillez remplir tous les champs obligatoires');
                    return;
                }
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                this.steps.personal = true;
                this.updateProgress();
                this.saveData();
                
                // Auto-open next section
                this.openSections.personal = false;
                this.openSections.identity = true;
                
                this.showNotification('Informations personnelles sauvegardées', 'success');
                
            } catch (error) {
                console.error('Error saving personal info:', error);
                this.showNotification('Erreur lors de la sauvegarde', 'error');
            } finally {
                this.loading = false;
            }
        },
        
        // Handle file upload for identity documents
        handleFileUpload(event, side) {
            const file = event.target.files[0];
            if (!file) return;
            
            // Validate file
            if (!this.validateFile(file)) return;
            
            if (side === 'front') {
                this.identityDoc.frontFile = file;
            } else {
                this.identityDoc.backFile = file;
            }
        },
        
        // Handle address proof file upload
        handleAddressFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            if (!this.validateFile(file)) return;
            
            this.addressProof.file = file;
        },
        
        // Validate uploaded files
        validateFile(file) {
            const maxSize = 10 * 1024 * 1024; // 10MB
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            
            if (file.size > maxSize) {
                alert('Le fichier est trop volumineux (max 10MB)');
                return false;
            }
            
            if (!allowedTypes.includes(file.type)) {
                alert('Type de fichier non supporté. Utilisez JPG, PNG ou PDF');
                return false;
            }
            
            return true;
        },
        
        // Upload identity documents
        async uploadIdentityDocuments() {
            if (!this.identityDoc.type || !this.identityDoc.number) {
                alert('Veuillez remplir le type et le numéro du document');
                return;
            }
            
            if (!this.identityDoc.frontFile || !this.identityDoc.backFile) {
                alert('Veuillez télécharger le recto et le verso du document');
                return;
            }
            
            this.loading = true;
            
            try {
                // Simulate file upload
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                this.identityDoc.uploaded = true;
                this.steps.documents = true;
                this.updateProgress();
                this.saveData();
                
                // Auto-open next section
                this.openSections.identity = false;
                this.openSections.address = true;
                
                this.showNotification('Documents d\'identité téléchargés', 'success');
                
            } catch (error) {
                console.error('Error uploading documents:', error);
                this.showNotification('Erreur lors du téléchargement', 'error');
            } finally {
                this.loading = false;
            }
        },
        
        // Upload address proof
        async uploadAddressProof() {
            if (!this.addressProof.type || !this.addressProof.file) {
                alert('Veuillez sélectionner le type de justificatif et télécharger le document');
                return;
            }
            
            this.loading = true;
            
            try {
                // Simulate file upload
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                this.addressProof.uploaded = true;
                this.steps.address = true;
                this.updateProgress();
                this.saveData();
                
                // Auto-open next section
                this.openSections.address = false;
                this.openSections.financial = true;
                
                this.showNotification('Justificatif de domicile téléchargé', 'success');
                
            } catch (error) {
                console.error('Error uploading address proof:', error);
                this.showNotification('Erreur lors du téléchargement', 'error');
            } finally {
                this.loading = false;
            }
        },
        
        // Save financial information
        async saveFinancialInfo() {
            this.loading = true;
            
            try {
                // Validate required fields
                const required = ['profession', 'income', 'fundsSource'];
                const isComplete = required.every(field => this.financialInfo[field]);
                
                if (!isComplete) {
                    alert('Veuillez remplir tous les champs obligatoires');
                    return;
                }
                
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                this.saveData();
                this.showNotification('Informations financières sauvegardées', 'success');
                
            } catch (error) {
                console.error('Error saving financial info:', error);
                this.showNotification('Erreur lors de la sauvegarde', 'error');
            } finally {
                this.loading = false;
            }
        },
        
        // Check if KYC can be submitted
        canSubmit() {
            return this.steps.personal && 
                   this.steps.documents && 
                   this.steps.address && 
                   this.agreements.terms && 
                   this.agreements.kyc;
        },
        
        // Submit KYC for verification
        async submitKYC() {
            if (!this.canSubmit()) {
                alert('Veuillez compléter toutes les étapes et accepter les conditions');
                return;
            }
            
            this.loading = true;
            
            try {
                // Simulate API submission
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                this.kycStatus = 'pending';
                this.steps.verification = true;
                this.updateProgress();
                this.saveData();
                
                // Save status
                localStorage.setItem('kyc_status', 'pending');
                
                this.showSuccessModal = true;
                
                // Simulate verification process (for demo)
                setTimeout(() => {
                    this.kycStatus = 'verified';
                    localStorage.setItem('kyc_status', 'verified');
                    this.showNotification('KYC vérifié avec succès !', 'success');
                }, 5000);
                
            } catch (error) {
                console.error('Error submitting KYC:', error);
                this.showNotification('Erreur lors de la soumission', 'error');
            } finally {
                this.loading = false;
            }
        },
        
        // Save as draft
        saveDraft() {
            this.saveData();
            this.showNotification('Brouillon sauvegardé', 'info');
        },
        
        // Show notification
        showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                type === 'success' ? 'bg-green-500 text-white' :
                type === 'error' ? 'bg-red-500 text-white' :
                'bg-blue-500 text-white'
            }`;
            notification.innerHTML = `
                <div class="flex items-center space-x-2">
                    <i class="fas ${
                        type === 'success' ? 'fa-check-circle' :
                        type === 'error' ? 'fa-exclamation-circle' :
                        'fa-info-circle'
                    }"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.remove();
            }, 3000);
        },
        
        // Reset KYC data (for testing)
        resetKYC() {
            if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données KYC ?')) {
                localStorage.removeItem('kyc_data');
                localStorage.removeItem('kyc_status');
                location.reload();
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add any additional initialization here
    console.log('KYC page loaded');
});

// Utility functions
const KYCUtils = {
    // Format file size
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // Validate French phone number
    validatePhoneNumber(phone) {
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        return phoneRegex.test(phone);
    },
    
    // Validate date of birth (must be 18+)
    validateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        const age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age >= 18;
    },
    
    // Generate document reference
    generateDocumentRef() {
        return 'DOC-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
};