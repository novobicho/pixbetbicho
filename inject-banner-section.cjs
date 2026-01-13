const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client', 'src', 'components', 'system-settings.tsx');

// Ler o arquivo
let content = fs.readFileSync(filePath, 'utf8');

// Código da seção de banners (sem os comentários iniciais)
const bannerSection = `
                    {/* Banners Promocionais */}
                    <div className="pt-6 border-t border-gray-100">
                      <h3 className="text-lg font-medium mb-4">Banners Promocionais</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Configure banners diferentes para desktop e mobile para evitar distorções.
                      </p>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {/* Banner Desktop */}
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="banner-desktop-url" className="font-medium text-base mb-2 block">
                              Banner Desktop
                            </Label>
                            <div className="flex flex-col gap-4">
                              <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                                {settings.bannerDesktopUrl ? (
                                  <img src={settings.bannerDesktopUrl} alt="Banner Desktop" className="max-w-full max-h-[180px] object-contain rounded" />
                                ) : (
                                  <div className="text-gray-400 text-center">
                                    <Upload className="w-12 h-12 mx-auto mb-2" />
                                    <span className="text-sm">Banner Desktop não definido</span>
                                    <p className="text-xs mt-1">Recomendado: 1920x400px</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-3">
                                <Input id="banner-desktop-url" type="text" placeholder="URL do banner desktop (ex: /img/banner-desktop.jpg)" value={settings.bannerDesktopUrl || ''} onChange={(e) => updateSettings("bannerDesktopUrl", e.target.value)} className="w-full" />
                                <p className="text-xs text-gray-500">Banner exibido em telas grandes (desktop/tablet). Tamanho recomendado: 1920x400px. Formato: JPG ou PNG.</p>
                                
                                <div className="flex flex-wrap gap-2">
                                  <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => updateSettings("bannerDesktopUrl", "/img/banner-desktop.jpg")}>Restaurar Padrão</Button>
                                  <div>
                                    <input type="file" id="banner-desktop-upload" className="hidden" accept="image/jpeg,image/png,image/jpg" onChange={(e) => handleImageUpload(e, 'bannerDesktop')} />
                                    <Button type="button" variant="secondary" size="sm" className="text-xs flex items-center gap-1" onClick={() => { const fileInput = document.getElementById('banner-desktop-upload') as HTMLInputElement; fileInput?.click(); }}>
                                      <Upload className="h-3 w-3" />Selecionar Imagem
                                    </Button>
                                  </div>
                                </div>
                                
                                {selectedImages.bannerDesktop && (
                                  <div className="mt-2 border border-dashed border-gray-300 p-3 rounded-md bg-blue-50">
                                    <div className="flex items-center gap-3">
                                      <div className="h-16 w-24 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img src={selectedImages.bannerDesktop.data} alt="Banner Desktop preview" className="h-full w-full object-cover" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs text-gray-600 mb-1 font-medium">{selectedImages.bannerDesktop.file.name}</p>
                                        <p className="text-xs text-gray-500 mb-2">Tamanho: {(selectedImages.bannerDesktop.file.size / 1024).toFixed(0)} KB</p>
                                        <Button type="button" variant="default" size="sm" className="text-xs" onClick={() => uploadSelectedImage('bannerDesktop')}>Carregar Banner Desktop</Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Banner Mobile */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <div>
                            <Label htmlFor="banner-mobile-url" className="font-medium text-base mb-2 block">Banner Mobile</Label>
                            <div className="flex flex-col gap-4">
                              <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                                {settings.bannerMobileUrl ? (
                                  <img src={settings.bannerMobileUrl} alt="Banner Mobile" className="max-w-full max-h-[180px] object-contain rounded" />
                                ) : (
                                  <div className="text-gray-400 text-center">
                                    <Upload className="w-12 h-12 mx-auto mb-2" />
                                    <span className="text-sm">Banner Mobile não definido</span>
                                    <p className="text-xs mt-1">Recomendado: 800x600px</p>
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-3">
                                <Input id="banner-mobile-url" type="text" placeholder="URL do banner mobile (ex: /img/banner-mobile.jpg)" value={settings.bannerMobileUrl || ''} onChange={(e) => updateSettings("bannerMobileUrl", e.target.value)} className="w-full" />
                                <p className="text-xs text-gray-500">Banner exibido em telas pequenas (smartphones). Tamanho recomendado: 800x600px. Formato: JPG ou PNG.</p>
                                
                                <div className="flex flex-wrap gap-2">
                                  <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => updateSettings("bannerMobileUrl", "/img/banner-mobile.jpg")}>Restaurar Padrão</Button>
                                  <div>
                                    <input type="file" id="banner-mobile-upload" className="hidden" accept="image/jpeg,image/png,image/jpg" onChange={(e) => handleImageUpload(e, 'bannerMobile')} />
                                    <Button type="button" variant="secondary" size="sm" className="text-xs flex items-center gap-1" onClick={() => { const fileInput = document.getElementById('banner-mobile-upload') as HTMLInputElement; fileInput?.click(); }}>
                                      <Upload className="h-3 w-3" />Selecionar Imagem
                                    </Button>
                                  </div>
                                </div>
                                
                                {selectedImages.bannerMobile && (
                                  <div className="mt-2 border border-dashed border-gray-300 p-3 rounded-md bg-green-50">
                                    <div className="flex items-center gap-3">
                                      <div className="h-16 w-24 rounded overflow-hidden flex-shrink-0 border border-gray-200">
                                        <img src={selectedImages.bannerMobile.data} alt="Banner Mobile preview" className="h-full w-full object-cover" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs text-gray-600 mb-1 font-medium">{selectedImages.bannerMobile.file.name}</p>
                                        <p className="text-xs text-gray-500 mb-2">Tamanho: {(selectedImages.bannerMobile.file.size / 1024).toFixed(0)} KB</p>
                                        <Button type="button" variant="default" size="sm" className="text-xs" onClick={() => uploadSelectedImage('bannerMobile')}>Carregar Banner Mobile</Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">📐 Tamanhos Recomendados</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-700">
                            <div><strong>Desktop:</strong> 1920x400px (paisagem)<br />Ideal para telas grandes e widescreen</div>
                            <div><strong>Mobile:</strong> 800x600px (retrato)<br />Otimizado para smartphones</div>
                          </div>
                          <p className="text-xs text-blue-600 mt-2">💡 Dica: Use imagens diferentes para evitar distorções. O sistema escolhe automaticamente qual banner exibir baseado no tamanho da tela.</p>
                        </div>
                      </div>
                    </div>
`;

// Procurar pelo marcador onde inserir
const marker = '                    </div>\n                  </div>\n                </div>\n              </div>\n\n              {/* Esquema de Cores */}';

if (content.includes(marker)) {
    // Inserir a seção de banners antes do marcador
    content = content.replace(marker, `                    </div>${bannerSection}\n                  </div>\n                </div>\n              </div>\n\n              {/* Esquema de Cores */}`);

    // Salvar o arquivo
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ Seção de banners adicionada com sucesso!');
} else {
    console.log('❌ Marcador não encontrado. Verifique o arquivo manualmente.');
}
