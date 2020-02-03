export default function config() {
  this.get('/inventory/instances', (schema) => {
    const {
      instances,
    } = schema;

    return instances.all();
  });
}
