import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../login/auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FiltroPrincipal } from '../services/fliltro-principal.service';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [ FormsModule, RouterModule, CommonModule],
  templateUrl: './caja.component.html',
  styleUrl: './caja.component.scss'
})

export class CajaComponent implements OnInit {
  @Input() controlLongitud: number = 8;
  filterListaProductosMasComprados: any[] = [];
  products: any[] = [
  ];
  
  beautyProducts = [
    {
      id: 1,
      name: 'Mascarilla para boca',
      description: 'Mascarilla hidratante y rejuvenecedora para los labios.',
      price: 15.99,
      available: true,
      priority: 8
    },
    {
      id: 2,
      name: 'Crema hidratante facial',
      description: 'Crema ligera con extracto de aloe vera para hidratar y suavizar la piel del rostro.',
      price: 24.99,
      available: true,
      priority: 9
    },
    {
      id: 3,
      name: 'Sérum antiarrugas para controla toditititas las arrugas malvavisco',
      description: 'Sérum concentrado para reducir las líneas de expresión y arrugas.',
      price: 39.99,
      available: true,
      priority: 10
    },
    {
      id: 4,
      name: 'Gel limpiador facial',
      description: 'Gel suave para limpiar la piel del rostro sin resecarla.',
      price: 12.50,
      available: true,
      priority: 7
    },
    {
      id: 5,
      name: 'Tónico facial',
      description: 'Tónico refrescante con agua de rosas para tonificar la piel.',
      price: 18.75,
      available: true,
      priority: 6
    },
    {
      id: 6,
      name: 'Exfoliante corporal',
      description: 'Exfoliante con gránulos naturales para eliminar células muertas.',
      price: 22.00,
      available: true,
      priority: 5
    },
    {
      id: 7,
      name: 'Crema de manos',
      description: 'Crema nutritiva para manos con manteca de karité.',
      price: 8.99,
      available: true,
      priority: 4
    },
    {
      id: 8,
      name: 'Aceite capilar',
      description: 'Aceite nutritivo para cabello seco y dañado.',
      price: 29.99,
      available: true,
      priority: 9
    },
    {
      id: 9,
      name: 'Mascarilla facial',
      description: 'Mascarilla de arcilla purificante para limpiar los poros.',
      price: 16.50,
      available: true,
      priority: 7
    },
    {
      id: 10,
      name: 'Protector solar',
      description: 'Protector solar SPF 50 para todo tipo de piel.',
      price: 19.99,
      available: true,
      priority: 8
    },
    {
      id: 11,
      name: 'Crema antiacné',
      description: 'Crema de tratamiento para reducir el acné y las imperfecciones.',
      price: 14.50,
      available: true,
      priority: 6
    },
    {
      id: 12,
      name: 'Crema para ojos',
      description: 'Crema ligera para reducir bolsas y ojeras.',
      price: 34.99,
      available: true,
      priority: 10
    },
    {
      id: 13,
      name: 'Manteca corporal',
      description: 'Manteca corporal ultra hidratante con aroma a coco.',
      price: 20.00,
      available: true,
      priority: 5
    },
    {
      id: 14,
      name: 'Desmaquillante bifásico',
      description: 'Desmaquillante efectivo para ojos y labios.',
      price: 17.75,
      available: true,
      priority: 7
    },
    {
      id: 15,
      name: 'Jabón facial sólido',
      description: 'Jabón sólido con carbón activado para piel grasa.',
      price: 9.99,
      available: true,
      priority: 4
    },
    {
      id: 16,
      name: 'Bálsamo labial',
      description: 'Bálsamo hidratante para labios con protector solar.',
      price: 4.99,
      available: true,
      priority: 3
    },
    {
      id: 17,
      name: 'Loción corporal',
      description: 'Loción ligera para hidratar la piel de todo el cuerpo.',
      price: 13.50,
      available: true,
      priority: 6
    },
    {
      id: 18,
      name: 'Champú sin sulfatos',
      description: 'Champú suave sin sulfatos para cabello teñido.',
      price: 15.75,
      available: true,
      priority: 8
    },
    {
      id: 19,
      name: 'Mascarilla capilar',
      description: 'Mascarilla profunda para restaurar el cabello dañado.',
      price: 21.99,
      available: true,
      priority: 9
    },
    {
      id: 20,
      name: 'Spray fijador de maquillaje',
      description: 'Spray fijador para mantener el maquillaje intacto todo el día.',
      price: 18.99,
      available: true,
      priority: 7
    }
  ];

  topPriorityProducts: any[] = [];
  total: number = 0;
  
  ngOnInit(): void {
    this.dataService.getFilteredData().subscribe(data => {
      this.filterListaProductosMasComprados = this.beautyProducts.filter(item => item.name.toLowerCase().includes(data.toLowerCase()));
      this.topPriorityProducts = this.filterListaProductosMasComprados
      .sort((a, b) => b.priority - a.priority)
      .slice(0, this.controlLongitud);
    });
    this.calcularTotal();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['controlLongitud']) {
      this.topPriorityProducts = this.beautyProducts
      .sort((a, b) => b.priority - a.priority)
      .slice(0, this.controlLongitud); // Tomar los primeros productos
    }
  }

  agregarProductos(productToAdd: any){
    if (productToAdd) {
      // Si el producto ya existe en la lista de productos, aumenta la cantidad
      const existingProduct = this.products.find(product => product.id === productToAdd.id);
      
      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.pTotal = existingProduct.quantity * existingProduct.price;
      } else {
        this.products.push({ ...productToAdd, quantity: 1, pTotal:productToAdd.price });
      }
      this.calcularTotal();
    }
  }

  onQuantityChange(productIn: any) {
    if (productIn.quantity <= 0)
    {
      const index = this.products.findIndex(product => product.id === productIn.id);
      this.products.splice(index, 1);
    } else {
      productIn.pTotal = productIn.quantity * productIn.price;
    }
    this.calcularTotal();
  }

  limpiarTicket(){
    this.products = [];
    this.calcularTotal();
  }

  quitarProductoTicket(productIn:any){
    const index = this.products.findIndex(product => product.id === productIn.id);
    this.products.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal(){
    this.total=0;
    this.products.forEach(element => {
      this.total += element.pTotal;
    });
  }

  constructor(private authService: AuthServiceService, private router: Router, private dataService: FiltroPrincipal) { }

  onLogOut(): void {
    this.authService.logout();
  }
}
