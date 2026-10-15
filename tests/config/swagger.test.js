const { swaggerDocument } = require('../../src/config/swagger');

describe('Swagger Documentation Specification', () => {
  it('should have valid OpenAPI 3.0 basic structure', () => {
    expect(swaggerDocument.openapi).toBe('3.0.0');
    expect(swaggerDocument.info).toBeDefined();
    expect(swaggerDocument.info.title).toBeDefined();
    expect(swaggerDocument.paths).toBeDefined();
    expect(swaggerDocument.components).toBeDefined();
  });

  it('should define Bearer authentication security scheme', () => {
    expect(swaggerDocument.components.securitySchemes.bearerAuth).toBeDefined();
    expect(swaggerDocument.components.securitySchemes.bearerAuth.type).toBe('http');
    expect(swaggerDocument.components.securitySchemes.bearerAuth.scheme).toBe('bearer');
  });

  it('should contain all major API routes', () => {
    const paths = Object.keys(swaggerDocument.paths);
    expect(paths).toContain('/api/health');
    expect(paths).toContain('/api/login');
    expect(paths).toContain('/api/users');
    expect(paths).toContain('/api/trucks');
    expect(paths).toContain('/api/remorques');
    expect(paths).toContain('/api/tires');
    expect(paths).toContain('/api/regles-maintenance');
    expect(paths).toContain('/api/maintenances');
    expect(paths).toContain('/api/trajets');
    expect(paths).toContain('/api/mes-trajets');
    expect(paths).toContain('/api/trajets/{id}/demarrer');
    expect(paths).toContain('/api/trajets/{id}/terminer');
  });

  it('should define essential schemas', () => {
    const schemas = swaggerDocument.components.schemas;
    expect(schemas.User).toBeDefined();
    expect(schemas.Truck).toBeDefined();
    expect(schemas.Remorque).toBeDefined();
    expect(schemas.Tire).toBeDefined();
    expect(schemas.MaintenanceRule).toBeDefined();
    expect(schemas.Maintenance).toBeDefined();
    expect(schemas.Trajet).toBeDefined();
  });
});
