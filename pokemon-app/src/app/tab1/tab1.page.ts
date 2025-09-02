import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonSpinner } from '@ionic/angular/standalone';
import { PokemonService, Pokemon } from '../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, IonSpinner, CommonModule, FormsModule, RouterModule],
})
export class Tab1Page implements OnInit {
  pokemonList: Pokemon[] = [];
  filteredPokemonList: Pokemon[] = [];
  offset = 0;
  limit = 20;
  isLoading = false;
  searchTerm = '';

  constructor(private pokemonService: PokemonService, private router: Router) {}

  ngOnInit() {
    this.loadPokemon();
  }

  async loadPokemon() {
    this.isLoading = true;
    try {
      const response = await this.pokemonService.getPokemonList(this.limit, this.offset).toPromise();
      if (response) {
        // Obtener detalles de cada Pokémon
        const pokemonDetails = await Promise.all(
          response.results.map(async (pokemon) => {
            const id = this.pokemonService.getPokemonIdFromUrl(pokemon.url);
            const details = await this.pokemonService.getPokemonDetails(id).toPromise();
            return { ...details, id } as Pokemon;
          })
        );
        
        this.pokemonList = [...this.pokemonList, ...pokemonDetails];
        this.filteredPokemonList = this.pokemonList;
        this.offset += this.limit;
      }
    } catch (error) {
      console.error('Error loading Pokemon:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadMore(event: any) {
    await this.loadPokemon();
    event.target.complete();
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    if (this.searchTerm.trim() === '') {
      this.filteredPokemonList = this.pokemonList;
    } else {
      this.filteredPokemonList = this.pokemonList.filter(pokemon =>
        pokemon.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getPokemonImage(pokemon: Pokemon): string {
    return pokemon.sprites?.other?.['official-artwork']?.front_default || 
           pokemon.sprites?.front_default || 
           'assets/pokemon-placeholder.png';
  }

  getPokemonTypes(pokemon: Pokemon): string {
    return pokemon.types?.map(type => type.type.name).join(', ') || 'Unknown';
  }

  goToPokemonDetail(pokemon: Pokemon) {
    this.router.navigate(['/tabs/tab2', pokemon.id]);
  }
}
